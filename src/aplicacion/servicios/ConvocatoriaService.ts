// ============================================================================
// SERVICIO CONVOCATORIA - Recibir y consultar convocatorias desde MS PERSONAL
// ============================================================================

import { IConvocatoriaRepository } from '../../dominio/repositorios/IConvocatoriaRepository';
import { Convocatoria, RecibirConvocatoriaInput, ConvocatoriaFilters } from '../../dominio/entidades/Convocatoria';

export class ConvocatoriaService {
  constructor(private readonly convocatoriaRepository: IConvocatoriaRepository) {}

  async recibirConvocatoria(input: RecibirConvocatoriaInput): Promise<Convocatoria> {
    return this.convocatoriaRepository.crearOActualizarPorRequerimientoPersonalId(input);
  }

  async getByRequerimientoPersonalId(requerimientoPersonalId: string): Promise<Convocatoria | null> {
    return this.convocatoriaRepository.findByRequerimientoPersonalId(requerimientoPersonalId);
  }

  async getById(id: string): Promise<Convocatoria | null> {
    return this.convocatoriaRepository.findById(id);
  }

  async list(limit?: number, offset?: number, filters?: ConvocatoriaFilters): Promise<{ convocatorias: Convocatoria[]; totalCount: number }> {
    return this.convocatoriaRepository.list(limit ?? 50, offset ?? 0, filters);
  }

  async obtenerConvocatoria(id: string): Promise<Convocatoria | null> {
    return this.getById(id);
  }

  async actualizar(id: string, datos: Partial<Convocatoria>): Promise<Convocatoria> {
    return this.convocatoriaRepository.actualizar(id, datos);
  }
}
