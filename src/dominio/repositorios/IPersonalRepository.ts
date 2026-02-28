// ============================================================================
// INTERFAZ DEL REPOSITORIO - PERSONAL (PUERTO DE SALIDA)
// ============================================================================

import { IBaseRepository } from './IBaseRepository';
import { Personal, PersonalFilterInput, PersonalReferenciasInput, PersonalPaginadoResult } from '../entidades/Personal';

export interface CrearEmpleadoInput {
  dni: string;
  nombres: string;
  ap_paterno: string;
  ap_materno: string;
  celular?: string;
  correo_personal?: string;
  direccion?: string;
  requerimiento_asignado_codigo?: string;
  usuario_id?: string;
}

export interface ActualizarEmpleadoInput {
  celular?: string;
  correo_personal?: string;
  correo_corporativo?: string;
  estado?: boolean;
  disponibilidad?: boolean;
  requerimiento_asignado_codigo?: string;
}

export interface IPersonalRepository extends IBaseRepository<Personal> {
  /**
   * Obtener empleados paginados desde el sistema PERSONAL
   */
  empleadosPaginados(
    page?: number,
    limit?: number,
    filter?: PersonalFilterInput,
    referencias?: PersonalReferenciasInput
  ): Promise<PersonalPaginadoResult>;

  /**
   * Obtener empleado por ID desde el sistema PERSONAL
   */
  obtenerEmpleadoPorId(id: string): Promise<Personal | null>;

  /**
   * Buscar empleados por texto desde el sistema PERSONAL
   */
  buscarEmpleados(search?: string, page?: number, limit?: number): Promise<PersonalPaginadoResult>;

  /**
   * Obtener empleados disponibles desde el sistema PERSONAL
   */
  obtenerEmpleadosDisponibles(page?: number, limit?: number): Promise<PersonalPaginadoResult>;

  /**
   * Crear un nuevo empleado en el sistema PERSONAL
   */
  crearEmpleado(input: CrearEmpleadoInput): Promise<string>;

  /**
   * Buscar empleado por DNI en el sistema PERSONAL
   */
  buscarPorDNI(dni: string): Promise<Personal | null>;

  /**
   * Actualizar empleado en el sistema PERSONAL
   */
  actualizarEmpleado(id: string, input: ActualizarEmpleadoInput): Promise<void>;
}