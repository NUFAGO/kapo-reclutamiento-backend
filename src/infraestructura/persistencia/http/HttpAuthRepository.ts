import { IUsuarioRepository } from '../../../dominio/repositorios/IUsuarioRepository';
import { UsuarioInput, UsuarioResponse } from '../../../dominio/entidades/Usuario';
import { PaginationInput, PaginationResult } from '../../../dominio/valueObjects/Pagination';
import { GraphQLClient } from '../../http/GraphQLClient';
import { BaseHttpRepository } from './BaseHttpRepository';
import { ConfigService } from '../../config/ConfigService';

// ============================================================================
// ADAPTADOR HTTP → kapo-autentificacion (IAM central).
// Consume las queries NATIVAS de auth (RS256/JWKS) y mapea su forma nativa
// (cargo{}, usuario_roles[]) a los tipos de dominio (UsuarioResponse).
//
// El login propio se ELIMINÓ: la identidad la emite kapo-autentificacion vía
// el gateway. Aquí solo se leen/gestionan usuarios (enriquecimiento + CRUD).
//
// TOLERANCIA (pre-migración): puede haber usuarios SIN rol y/o SIN cargo. El
// mapeo NO falla en esos casos (deja los campos vacíos). empresa_id/obra_id NO
// son dominio de auth (son proxies opt-in) → se dejan vacíos, igual que en
// kapo-requerimientos.
// ============================================================================

/** Campos nativos de Usuario que pide auth. */
const USUARIO_NATIVO_FIELDS = `
  id
  nombres
  apellidos
  usuario
  dni
  telefono
  firma
  foto_perfil
  email
  cargo {
    id
    nombre
    descripcion
    gerarquia
  }
  usuario_roles {
    rol_id
    sistema_id
  }
`;

type AuthCargo = { id?: unknown; nombre?: unknown; descripcion?: unknown; gerarquia?: unknown };
type AuthUsuarioRol = { rol_id?: unknown; sistema_id?: unknown };
type AuthUsuario = {
  id?: unknown;
  nombres?: unknown;
  apellidos?: unknown;
  usuario?: unknown;
  dni?: unknown;
  telefono?: unknown;
  firma?: unknown;
  foto_perfil?: unknown;
  email?: unknown;
  cargo?: AuthCargo | null;
  usuario_roles?: AuthUsuarioRol[] | null;
};

/** auth-nativo → UsuarioResponse (forma de dominio). Tolerante a rol/cargo ausentes. */
function mapAuthUsuario(u: AuthUsuario): UsuarioResponse {
  const out: UsuarioResponse = {
    id: String(u.id ?? ''),
    nombres: String(u.nombres ?? ''),
    apellidos: String(u.apellidos ?? ''),
    usuario: String(u.usuario ?? ''),
    dni: String(u.dni ?? ''),
  };

  const cargo = u.cargo;
  if (cargo && cargo.id != null) {
    const c: NonNullable<UsuarioResponse['cargo_id']> = {
      id: String(cargo.id),
      nombre: String(cargo.nombre ?? ''),
    };
    if (cargo.descripcion != null) c.descripcion = String(cargo.descripcion);
    if (typeof cargo.gerarquia === 'number') c.gerarquia = cargo.gerarquia;
    out.cargo_id = c;
  }

  // rol_id aplanado (best-effort): toma el primer usuario_rol disponible.
  const roles = Array.isArray(u.usuario_roles) ? u.usuario_roles : [];
  if (roles.length > 0 && roles[0]?.rol_id != null) {
    out.rol_id = String(roles[0].rol_id);
  }

  if (u.telefono != null && String(u.telefono).trim() !== '') out.telefono = String(u.telefono);
  if (u.firma != null) out.firma = String(u.firma);
  if (u.foto_perfil != null) out.foto_perfil = String(u.foto_perfil);
  if (u.email != null) out.email = String(u.email);
  return out;
}

export class HttpAuthRepository
  extends BaseHttpRepository<any>
  implements IUsuarioRepository
{
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /** Cliente GraphQL → SOLO auth (mismo nombre como primario y fallback). */
  protected override async getClient(): Promise<GraphQLClient> {
    return super.getClient('auth-service', 'auth-service');
  }

  async list(): Promise<any[]> {
    throw new Error('list() not supported for HttpAuthRepository. Use getAllUsuarios() instead.');
  }

  protected getDefaultSearchFields(): string[] {
    return [];
  }

  /**
   * Llamadas M2M a auth con X-Internal-Gateway-Secret (sin JWT de usuario).
   * El enriquecimiento server-side NO debe depender del token del navegador ni
   * de la sesión Redis del usuario. Mismo patrón que kapo-requerimientos.
   */
  private async graphqlRequestAuthM2m(
    query: string,
    variables: Record<string, unknown> = {},
  ): Promise<any> {
    const config = ConfigService.getInstance();
    const upstreamSecret = config.getInternalUpstreamSecret();
    const authUrl = this.baseUrl ?? config.getAuthBackendUrl();
    const client = new GraphQLClient(authUrl, {
      headers: upstreamSecret ? { 'X-Internal-Gateway-Secret': upstreamSecret } : {},
    });
    const request: { query: string; variables?: Record<string, unknown> } = { query };
    if (variables && Object.keys(variables).length > 0) {
      request.variables = variables;
    }
    return client.request(request);
  }

  async getAllUsuarios(): Promise<UsuarioResponse[]> {
    const query = `
      query ListUsuariosActivosParaCatalogo($referencia: UsuarioReferenciaInput) {
        listUsuariosActivosParaCatalogo(referencia: $referencia) {
          ${USUARIO_NATIVO_FIELDS}
        }
      }
    `;
    const result = await this.graphqlRequestAuthM2m(query, {
      referencia: { conCargo: true, conUsuarioRoles: true },
    });
    const list = result?.listUsuariosActivosParaCatalogo;
    return Array.isArray(list) ? list.map(mapAuthUsuario) : [];
  }

  async getUsuario(id: string): Promise<UsuarioResponse | null> {
    const t = String(id ?? '').trim();
    if (!t) return null;
    const query = `
      query GetUsuariosByIds($ids: [ID!]!) {
        getUsuariosByIds(ids: $ids) {
          ${USUARIO_NATIVO_FIELDS}
        }
      }
    `;
    const result = await this.graphqlRequestAuthM2m(query, { ids: [t] });
    const u = result?.getUsuariosByIds?.[0];
    return u ? mapAuthUsuario(u) : null;
  }

  async usuariosCargo(): Promise<UsuarioResponse[]> {
    const query = `query { usuariosCargo { ${USUARIO_NATIVO_FIELDS} } }`;
    const result = await this.graphqlRequestAuthM2m(query);
    const list = result?.usuariosCargo;
    return Array.isArray(list) ? list.map(mapAuthUsuario) : [];
  }

  async getUsuariosByRegistrosGeneralesContables(): Promise<UsuarioResponse[]> {
    // Consulta de NEGOCIO que auth no expone (no es dominio de identidad).
    // Tolerante: lista vacía. Reimplementar vía getUsuariosByRolCargo si se
    // definen los roles correspondientes del sistema.
    return [];
  }

  async createUsuario(data: UsuarioInput): Promise<UsuarioResponse> {
    const input: Record<string, unknown> = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      usuario: data.usuario,
      dni: data.dni,
      contrasenna: data.contrasenna,
      telefono: data.telefono,
      email: data.email,
      cargo_id: data.cargo_id,
      roles_ids: data.rol_id ? [data.rol_id] : [],
      empresas_ids: data.empresa_id ?? [],
      obras_ids: data.obra_id ?? [],
    };
    const mutation = `
      mutation CreateUsuario($input: CreateUsuarioInput!) {
        createUsuario(input: $input) { ${USUARIO_NATIVO_FIELDS} }
      }
    `;
    const result = await this.graphqlRequestAuthM2m(mutation, { input });
    return mapAuthUsuario(result?.createUsuario ?? {});
  }

  async updateUsuario(id: string, data: UsuarioInput): Promise<UsuarioResponse> {
    const input: Record<string, unknown> = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      telefono: data.telefono,
      dni: data.dni,
      email: data.email,
      cargo_id: data.cargo_id,
      roles_agregar_ids: data.rol_id ? [data.rol_id] : [],
      roles_eliminar_ids: [],
    };
    const mutation = `
      mutation UpdateUsuario($id: ID!, $input: UpdateUsuarioInput!) {
        updateUsuario(id: $id, input: $input) { ${USUARIO_NATIVO_FIELDS} }
      }
    `;
    const result = await this.graphqlRequestAuthM2m(mutation, { id, input });
    return mapAuthUsuario(result?.updateUsuario ?? {});
  }

  async deleteUsuario(id: string): Promise<UsuarioResponse> {
    // auth.deleteUsuario devuelve Boolean!; recuperamos el usuario antes para
    // mantener el contrato de dominio (UsuarioResponse).
    const previo = await this.getUsuario(id);
    const mutation = `mutation DeleteUsuario($id: ID!) { deleteUsuario(id: $id) }`;
    await this.graphqlRequestAuthM2m(mutation, { id });
    return previo ?? ({ id, nombres: '', apellidos: '', usuario: '', dni: '' } as UsuarioResponse);
  }

  async listUsuariosPaginatedWithFilters(
    pagination: PaginationInput,
    filters?: { dni?: string; _id?: string; nombres?: string; apellidos?: string },
  ): Promise<PaginationResult<UsuarioResponse>> {
    // El filtro nativo de auth usa `search`; mapeamos lo que venga.
    const search =
      filters?.nombres || filters?.apellidos || filters?.dni || filters?._id || undefined;
    const query = `
      query ListUsuarioPaginado($page: Int!, $limit: Int!, $filter: UsuarioFiltro, $referencia: UsuarioReferenciaInput) {
        listUsuarioPaginado(page: $page, limit: $limit, filter: $filter, referencia: $referencia) {
          data { ${USUARIO_NATIVO_FIELDS} }
          total
          page
          limit
          totalPages
        }
      }
    `;
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const result = await this.graphqlRequestAuthM2m(query, {
      page,
      limit,
      filter: search ? { search } : {},
      referencia: { conCargo: true, conUsuarioRoles: true },
    });
    const raw = result?.listUsuarioPaginado;
    if (!raw || !Array.isArray(raw.data)) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
      };
    }
    const total = Number(raw.total ?? 0);
    const totalPages = Number(raw.totalPages ?? 0);
    const pageOut = Number(raw.page ?? page);
    return {
      data: raw.data.map(mapAuthUsuario),
      pagination: {
        page: pageOut,
        limit: Number(raw.limit ?? limit),
        total,
        totalPages,
        hasNext: pageOut < totalPages,
        hasPrev: pageOut > 1,
      },
    };
  }
}
