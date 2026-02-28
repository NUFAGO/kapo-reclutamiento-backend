// ============================================================================
// SERVICIO - PERSONAL (Consumo desde MS Personal)
// ============================================================================

import {
  Personal,
  PersonalFilterInput,
  PersonalReferenciasInput,
  PersonalPaginadoResult
} from '../../dominio/entidades/Personal';
import { IPersonalRepository, CrearEmpleadoInput, ActualizarEmpleadoInput } from '../../dominio/repositorios/IPersonalRepository';

/**
 * Servicio para consumir el endpoint empleadosPaginados del sistema PERSONAL/Personal
 */
export class PersonalService {
  private readonly personalRepository: IPersonalRepository;

  constructor(personalRepository: IPersonalRepository) {
    this.personalRepository = personalRepository;
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
    return await this.personalRepository.empleadosPaginados(page, limit, filter, referencias);
  }

  /**
   * Obtener empleado por ID desde el sistema PERSONAL
   */
  async obtenerEmpleadoPorId(id: string): Promise<Personal | null> {
    return await this.personalRepository.obtenerEmpleadoPorId(id);
  }

  /**
   * Buscar empleados por texto desde el sistema PERSONAL
   */
  async buscarEmpleados(search?: string, page: number = 1, limit: number = 10): Promise<PersonalPaginadoResult> {
    return await this.personalRepository.buscarEmpleados(search, page, limit);
  }

  /**
   * Obtener empleados disponibles desde el sistema PERSONAL
   */
  async obtenerEmpleadosDisponibles(page: number = 1, limit: number = 10): Promise<PersonalPaginadoResult> {
    return await this.personalRepository.obtenerEmpleadosDisponibles(page, limit);
  }

  /**
   * Crear un nuevo empleado en el sistema PERSONAL
   */
  async crearEmpleado(input: CrearEmpleadoInput): Promise<string> {
    console.log(`🔍 [PERSONAL_SERVICE] crearEmpleado llamado con DNI: ${input.dni} - Timestamp: ${new Date().toISOString()}`);
    console.trace('📍 [PERSONAL_SERVICE] Stack trace de llamada a crearEmpleado');
    
    return await this.personalRepository.crearEmpleado(input);
  }

  /**
   * Buscar empleado por DNI en el sistema PERSONAL
   */
  async buscarPorDNI(dni: string): Promise<Personal | null> {
    return await this.personalRepository.buscarPorDNI(dni);
  }

  /**
   * Actualizar empleado en el sistema PERSONAL
   */
  async actualizarEmpleado(id: string, input: ActualizarEmpleadoInput): Promise<void> {
    return await this.personalRepository.actualizarEmpleado(id, input);
  }
}