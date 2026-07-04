// ============================================================================
// AUTORIZACIÓN GRAPHQL (graphql-shield) — alineado con kapo-autentificacion
// ============================================================================
// Mismas reglas declarativas que el IAM central (isAuthenticated / hasPermission),
// leyendo permisos DESDE EL TOKEN (offline). Devuelve CÓDIGOS de error específicos
// para que el front sepa reaccionar:
//   · SESION_REVOCADA / TOKEN_INVALIDO → refrescar token y reintentar (silencioso)
//   · SIN_PERMISO                      → mostrar "no tienes permiso" (no reintentar)
//   · UNAUTHENTICATED                  → ir a login (no hay token)

import { rule, shield, allow } from 'graphql-shield';
import { GraphQLError } from 'graphql';

import { AuthClaims } from '../../../dominio/seguridad/AuthClaims';
import { ConfigService } from '../../config/ConfigService';

export interface ReclutamientoAuthContext {
  req?: unknown;
  token?: string;
  usuarioAuth?: AuthClaims | null;
  /** Motivo cuando NO hay usuarioAuth válido: TOKEN_EXPIRADO | TOKEN_INVALIDO | undefined(=sin token) */
  authMotivo?: string;
  /** true cuando la request llega del gateway INTERNO (X-Internal-Gateway-Secret válido, sin usuario) → llamada M2M confiable este-oeste. */
  internalTrusted?: boolean;
}

function errorNoAutenticado(ctx: ReclutamientoAuthContext): GraphQLError {
  const code = ctx.authMotivo ?? 'UNAUTHENTICATED';
  const msg =
    code === 'TOKEN_EXPIRADO'
      ? 'Tu sesión expiró. Renueva tus credenciales.'
      : code === 'TOKEN_INVALIDO'
        ? 'Credenciales inválidas. Renueva tus credenciales.'
        : 'No autenticado.';
  return new GraphQLError(msg, { extensions: { code } });
}

/** Autenticado y el token pertenece A ESTE sistema. */
const isAuthenticated = (sistemaCodigo: string) =>
  rule({ cache: 'contextual' })(
    async (_p, _a, ctx: ReclutamientoAuthContext) => {
      // Llamada M2M este-oeste (otro MS vía gateway interno): confiable por el
      // secreto de upstream. No trae usuario; se permite el consumo interno.
      if (ctx.internalTrusted) return true;
      const u = ctx.usuarioAuth;
      if (u?.sid) {
        if (u.sistema && u.sistema !== sistemaCodigo) {
          return new GraphQLError('Token de otro sistema.', {
            extensions: { code: 'SIN_PERMISO' },
          });
        }
        return true;
      }
      return errorNoAutenticado(ctx);
    },
  );

/** El usuario tiene el permiso indicado (leído de los claims del token). */
export const hasPermission = (permiso: string) =>
  rule({ cache: 'contextual' })(
    async (_p, _a, ctx: ReclutamientoAuthContext) => {
      const u = ctx.usuarioAuth;
      if (!u?.sid) return errorNoAutenticado(ctx);
      if (Array.isArray(u.permisos) && u.permisos.includes(permiso)) {
        return true;
      }
      return new GraphQLError('No tienes permiso para esta acción.', {
        extensions: { code: 'SIN_PERMISO' },
      });
    },
  );

/**
 * Construye el middleware de permisos.
 * Toda operación exige CONTEXTO de usuario — token decodificable con sub/sid y
 * del sistema correcto — o ser una llamada M2M confiable. NO valida
 * firma/sesión (eso es del gateway); evita resolvers sin usuarioAuth y tokens
 * de otro sistema kapo.
 */
export function buildPermissions(config: ConfigService) {
  const sistema = config.getSistemaCodigo();
  const protegerTodo = isAuthenticated(sistema);

  // IMPORTANTE: el fallbackRule de graphql-shield se aplica a CADA campo de
  // CADA tipo (incluidos los hijos de tipos de respuesta). Por eso NO usamos
  // fallbackRule global; en su lugar protegemos Query/Mutation con un "*"
  // (catch-all) y dejamos los tipos resultantes (Usuario, etc.) abiertos.
  return shield(
    {
      Query: {
        '*': protegerTodo,
        // --- Operaciones PÚBLICAS del flujo de postulación (sin sesión de usuario) ---
        // El candidato postula desde el formulario público (front (public)/postular).
        // Los datos sensibles van "encriptados"; el gateway debe marcarlas públicas.
        formularioConfigPorId: allow,
        listarCandidatosEncriptados: allow,
        obtenerCandidatoEncriptado: allow,
      },
      Mutation: {
        '*': protegerTodo,
        // (login/refreshToken ya no existen aquí — identidad directa a auth vía gateway)
        // Postulación pública del candidato (sin sesión).
        crearAplicacion: allow,
        // Ingesta M2M de convocatorias: protegida por su propio X-Recibir-Convocatoria-Secret
        // en el resolver, no por sesión de usuario.
        recibirConvocatoria: allow,
      },
    },
    {
      fallbackRule: allow, // sobre tipos hijos (Usuario, Role, etc.)
      allowExternalErrors: true,
    },
  );
}
