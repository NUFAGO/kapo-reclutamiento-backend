import { IPersonalRepository, CrearEmpleadoInput, ActualizarEmpleadoInput } from '../../../dominio/repositorios/IPersonalRepository';
import { Personal, PersonalFilterInput, PersonalReferenciasInput, PersonalPaginadoResult } from '../../../dominio/entidades/Personal';
import { BaseHttpRepository } from './BaseHttpRepository';
import { GraphQLClient } from '../../http/GraphQLClient';
import { logger } from '../../logging';

export class HttpPersonalRepository extends BaseHttpRepository<Personal> implements IPersonalRepository {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * Obtener o inicializar el cliente GraphQL para el servicio PERSONAL
   */
  protected override async getClient(_serviceName?: string, _fallbackServiceName?: string): Promise<GraphQLClient> {
    if (this.client) {
      return this.client;
    }

    if (this.baseUrl) {
      this.client = new GraphQLClient(this.baseUrl);
      return this.client;
    }

    try {
      const url = await this.serviceRegistry.getServiceUrl('personal-backend');
      this.client = new GraphQLClient(url);
      return this.client;
    } catch (error) {
      logger.error('No se pudo obtener el servicio personal-backend', { error });
      throw new Error('Servicio personal-backend no disponible');
    }
  }

  /**
   * Campos por defecto para búsqueda
   */
  protected getDefaultSearchFields(): string[] {
    return ['nombres', 'ap_paterno', 'ap_materno', 'dni'];
  }

  /**
   * Obtener empleados paginados desde el sistema PERSONAL
   */
  async empleadosPaginados(
    page: number = 1,
    limit: number = 10,
    filter?: PersonalFilterInput,
    referencias?: PersonalReferenciasInput
  ): Promise<PersonalPaginadoResult> {
    const query = `
      query empleadosPaginados(
        $page: Int
        $limit: Int
        $filter: EmpleadoFilterInput
        $referencias: EmpleadoReferenciasInput
      ) {
        empleadosPaginados(
          page: $page
          limit: $limit
          filter: $filter
          referencias: $referencias
        ) {
          data {
            id
            dni
            nombres
            ap_paterno
            ap_materno
            ruc
            fecha_nacimiento
            genero
            celular
            correo_personal
            correo_corporativo
            fecha_vencimiento_dni
            direccion
            fecha_creacion
            fecha_actualizacion
            fecha_registro
            fecha_ingreso
            empresa_id
            estado
            carrera
            formacion
            situacion_permanencia
            alta_t_registro
            estado_civil
            observaciones
            empleabilidad_id
            disponibilidad
            cargo_categoria_especialidad_id
              empleabilidades {
                id
                empleadoch_id
                obra_id
                fecha_ingreso
                fecha_baja
                estado
                cargo_categoria_especialidad_id
                movilidad {
                  id
                  obra_id
                  estado
                  motivo
                  observacion
                  fecha_inicio
                  fecha_fin
                  fecha_creacion
                  fecha_actualizacion
                }
                obra {
                  id
                  titulo
                  nombre
                  descripcion
                }
              }
              foto_perfil {
                id
                url
                referencia_id
                tipo
                nombre_archivo
                tamano_archivo
                fecha_creacion
              }
            estado_documento
            plantilla_id
            jefe_inmediato_id
            pension_tipo
            pension_tipo_comision
            pension_tipo_fecha_inicio
            pension_tipo_fecha_fin
            tipo_empleado
            usuario_id
            usuario_creacion {
              id
              nombres
              apellidos
              nombre_completo
              usuario
            }
            jefe_inmediato {
              id
              dni
              nombres
              ap_paterno
              ap_materno
            }
              historial_pension {
                id
                empleadoch_id
                pension_tipo_anterior
                pension_tipo_nuevo
                pension_tipo_comision_anterior
                pension_tipo_comision_nuevo
                pension_tipo_fecha_inicio_anterior
                pension_tipo_fecha_inicio_nuevo
                pension_tipo_fecha_fin_anterior
                pension_tipo_fecha_fin_nuevo
                usuario_id
                fecha_creacion
              }
            fecha_ingreso_personal
            fecha_salida_personal
          }
          total
          page
          limit
          totalPages
        }
      }
    `;

    const variables: any = {
      page,
      limit
    };

    // Solo incluir filter si tiene valores
    if (filter && Object.keys(filter).some(key => filter[key as keyof PersonalFilterInput] !== undefined)) {
      variables.filter = filter;
    }

    // Solo incluir referencias si tiene valores
    if (referencias && Object.keys(referencias).some(key => referencias[key as keyof PersonalReferenciasInput] !== undefined)) {
      variables.referencias = referencias;
    }

    try {
      const result = await this.graphqlRequest(query, variables, 'personal-backend');
      return result.empleadosPaginados;
    } catch (error) {
      logger.error('Error consumiendo empleadosPaginados', {
        error: error instanceof Error ? error.message : String(error),
        page,
        limit
      });
      throw error;
    }
  }

  /**
   * Obtener empleado por ID desde el sistema PERSONAL
   */
  async obtenerEmpleadoPorId(id: string): Promise<Personal | null> {
    try {
      const result = await this.empleadosPaginados(1, 1, { ids: [id] });
      return result.data.length > 0 ? result.data[0] || null : null;
    } catch (error) {
      logger.error('Error obteniendo empleado por ID', {
        error: error instanceof Error ? error.message : String(error),
        id
      });
      return null;
    }
  }

  /**
   * Buscar empleados por texto desde el sistema PERSONAL
   */
  async buscarEmpleados(search?: string, page: number = 1, limit: number = 10): Promise<PersonalPaginadoResult> {
    const filter: any = {};
    if (search && search.trim()) {
      filter.search = search.trim();
    }
    return this.empleadosPaginados(page, limit, filter);
  }

  /**
   * Obtener empleados disponibles desde el sistema PERSONAL
   */
  async obtenerEmpleadosDisponibles(page: number = 1, limit: number = 10): Promise<PersonalPaginadoResult> {
    return this.empleadosPaginados(page, limit, { disponibilidad: true });
  }

  /**
   * Lista todos los empleados (implementación requerida por BaseHttpRepository)
   * Método base - implementación básica
   */
  async list(): Promise<Personal[]> {
    try {
      const response = await this.empleadosPaginados(1, 1000);
      return response.data || [];
    } catch (error) {
      logger.error('Error listando empleados', {
        error: error instanceof Error ? error.message : String(error)
      });
      return [];
    }
  }

  /**
   * Buscar empleado por ID (implementación requerida por BaseHttpRepository)
   */
  async findById(id: string): Promise<Personal | null> {
    return this.obtenerEmpleadoPorId(id);
  }

  /**
   * Crear empleado (no implementado - el servicio PERSONAL maneja esto)
   */
  async create(_data: Partial<Personal>): Promise<Personal> {
    throw new Error('Crear empleado no está implementado en este repositorio');
  }

  /**
   * Actualizar empleado (no implementado - el servicio PERSONAL maneja esto)
   */
  async update(_id: string, _data: Partial<Personal>): Promise<Personal | null> {
    throw new Error('Actualizar empleado no está implementado en este repositorio');
  }

  /**
   * Eliminar empleado (no implementado - el servicio PERSONAL maneja esto)
   */
  async delete(_id: string): Promise<boolean> {
    throw new Error('Eliminar empleado no está implementado en este repositorio');
  }

  /**
   * Buscar empleado por DNI en el sistema PERSONAL
   */
  async buscarPorDNI(dni: string): Promise<Personal | null> {
    console.log(`[HTTP_PERSONAL_REPO] Buscando empleado con DNI exacto: "${dni}"`);
    
    const query = `
      query getEmpleadosPaginados($page: Int, $limit: Int, $filter: EmpleadoFilterInput) {
        empleadosPaginados(page: $page, limit: $limit, filter: $filter) {
          data {
            id
            dni
            nombres
            ap_paterno
            ap_materno
          }
          total
          page
          limit
          totalPages
        }
      }
    `;

    try {
      const response = await this.graphqlRequest(query, {
        page: 1,
        limit: 1,
        filter: { search: dni.trim() }  // Usar search con DNI exacto (el único campo disponible)
      }, 'personal-backend');
      
      console.log(`[HTTP_PERSONAL_REPO] Respuesta de PERSONAL:`, response);
      
      const empleados = response.empleadosPaginados?.data || [];
      console.log(`[HTTP_PERSONAL_REPO] Empleados encontrados: ${empleados.length}`);
      
      // Filtrar por DNI exacto después de la búsqueda
      const empleadoExacto = empleados.find((emp: { dni: string }) => emp.dni === dni.trim());
      console.log(`[HTTP_PERSONAL_REPO] Empleado con DNI exacto:`, empleadoExacto);
      
      if (empleadoExacto) {
        return empleadoExacto;
      }
      
      console.log(`[HTTP_PERSONAL_REPO] No se encontró empleado con DNI exacto: ${dni}`);
      return null;
    } catch (error) {
      logger.error('Error buscando empleado por DNI en PERSONAL', { error, dni });
      console.log('🚫 [HTTP-PERSONAL] Error en búsqueda:', error)
      return null;
    }
  }

  /**
   * Crear un nuevo empleado en el sistema PERSONAL
   */
  async crearEmpleado(input: CrearEmpleadoInput): Promise<string> {
    console.log('🚀 [HTTP-PERSONAL] Iniciando crearEmpleado')
    console.log('📝 [HTTP-PERSONAL] Input:', JSON.stringify(input, null, 2))
    console.log('🔗 [HTTP-PERSONAL] Endpoint: personal-backend')
    
    const mutation = `
      mutation createEmpleadoCH($input: CreateEmpleadoCHInput!) {
        createEmpleadoCH(input: $input) {
          id
        }
      }
    `;

    try {
      console.log('📡 [HTTP-PERSONAL] Ejecutando this.graphqlRequest')
      const startTime = Date.now()
      const response = await this.graphqlRequest(mutation, { input }, 'personal-backend');
      const endTime = Date.now()
      
      console.log('✅ [HTTP-PERSONAL] graphqlRequest completado')
      console.log('⏱️ [HTTP-PERSONAL] Duración:', endTime - startTime, 'ms')
      console.log('📦 [HTTP-PERSONAL] Response:', JSON.stringify(response, null, 2))
      
      const empleadoId = response.createEmpleadoCH.id;
      console.log('🆔 [HTTP-PERSONAL] Empleado ID retornado:', empleadoId)
      
      return empleadoId;
    } catch (error) {
      console.log('❌ [HTTP-PERSONAL] Error en crearEmpleado:', error)
      const errorMessage = (error as Error).message;
      logger.error('Error creando empleado en PERSONAL', { error, input });
      throw new Error(`Error creando empleado: ${errorMessage}`);
    }
  }

  /**
   * Actualizar empleado en el sistema PERSONAL
   */
  async actualizarEmpleado(id: string, input: ActualizarEmpleadoInput): Promise<void> {
    console.log('🚀 [HTTP-PERSONAL] Iniciando actualizarEmpleado')
    console.log('📝 [HTTP-PERSONAL] ID:', id)
    console.log('📝 [HTTP-PERSONAL] Input:', JSON.stringify(input, null, 2))
    
    const mutation = `
      mutation updateEmpleadoCH($id: ID!, $input: UpdateEmpleadoCHInput!) {
        updateEmpleadoCH(id: $id, input: $input) {
          id
        }
      }
    `;

    try {
      console.log('📡 [HTTP-PERSONAL] Ejecutando this.graphqlRequest')
      const startTime = Date.now()
      const response = await this.graphqlRequest(mutation, { id, input }, 'personal-backend');
      const endTime = Date.now()
      
      console.log('✅ [HTTP-PERSONAL] graphqlRequest completado')
      console.log('⏱️ [HTTP-PERSONAL] Duración:', endTime - startTime, 'ms')
      console.log('📦 [HTTP-PERSONAL] Response:', JSON.stringify(response, null, 2))
      
    } catch (error) {
      console.log('❌ [HTTP-PERSONAL] Error en actualizarEmpleado:', error)
      const errorMessage = (error as Error).message;
      logger.error('Error actualizando empleado en PERSONAL', { error, id, input });
      throw new Error(`Error actualizando empleado: ${errorMessage}`);
    }
  }
}