// ============================================================================
// REPOSITORIO MONGODB DEBIDA DILIGENCIA - Implementación de persistencia
// ============================================================================

import { DebidaDiligenciaModel } from './schemas/DebidaDiligenciaSchema';
import { IDebidaDiligenciaRepository } from '../../../dominio/repositorios/IDebidaDiligenciaRepository';
import {
  DebidaDiligencia,
  CrearDebidaDiligenciaInput,
  ActualizarDebidaDiligenciaInput,
  NivelRiesgo
} from '../../../dominio/entidades/DebidaDiligencia';

export class DebidaDiligenciaMongoRepository implements IDebidaDiligenciaRepository {
  async crear(input: CrearDebidaDiligenciaInput): Promise<DebidaDiligencia> {
    const documento = new DebidaDiligenciaModel(input);
    const savedDoc = await documento.save();

    const result: any = {
      id: savedDoc._id.toString(),
      aplicacionCandidatoId: savedDoc.aplicacionCandidatoId.toString(),
      candidatoId: savedDoc.candidatoId.toString(),
      evaluador_id: savedDoc.evaluador_id.toString(),
      nombre_evaluador: savedDoc.nombre_evaluador,
      codigo: savedDoc.codigo,
      version: savedDoc.version,
      fecha_evaluacion: savedDoc.fecha_evaluacion,
      criterios: savedDoc.criterios as Record<string, { ponderacion: number; respuesta: 'SI' | 'NO' | 'NA'; puntaje: number }>,
      puntaje_total: savedDoc.puntaje_total,
      nivel_riesgo: savedDoc.nivel_riesgo,
      created_at: savedDoc.created_at,
      updated_at: savedDoc.updated_at
    };

    if (savedDoc.fecha_aprobacion !== undefined) result.fecha_aprobacion = savedDoc.fecha_aprobacion;
    if (savedDoc.accion !== undefined) result.accion = savedDoc.accion;
    if (savedDoc.controles !== undefined) result.controles = savedDoc.controles.map(control => ({
      criterio: control.criterio,
      responsable: (control.responsable || '').toString(),
      fecha_limite: control.fecha_limite
    }));

    return result as DebidaDiligencia;
  }

  async obtenerPorId(id: string): Promise<DebidaDiligencia | null> {
    const documento = await DebidaDiligenciaModel.findById(id);
    if (!documento) return null;

    const result: any = {
      id: documento._id.toString(),
      aplicacionCandidatoId: documento.aplicacionCandidatoId.toString(),
      candidatoId: documento.candidatoId.toString(),
      evaluador_id: documento.evaluador_id.toString(),
      nombre_evaluador: documento.nombre_evaluador,
      codigo: documento.codigo,
      version: documento.version,
      fecha_evaluacion: documento.fecha_evaluacion,
      criterios: documento.criterios as Record<string, { ponderacion: number; respuesta: 'SI' | 'NO' | 'NA'; puntaje: number }>,
      puntaje_total: documento.puntaje_total,
      nivel_riesgo: documento.nivel_riesgo,
      created_at: documento.created_at,
      updated_at: documento.updated_at
    };

    if (documento.fecha_aprobacion !== undefined) result.fecha_aprobacion = documento.fecha_aprobacion;
    if (documento.accion !== undefined) result.accion = documento.accion;
    if (documento.controles !== undefined) result.controles = documento.controles.map(control => ({
      criterio: control.criterio,
      responsable: (control.responsable || '').toString(),
      fecha_limite: control.fecha_limite
    }));

    return result as DebidaDiligencia;
  }

  async obtenerPorAplicacion(aplicacionCandidatoId: string): Promise<DebidaDiligencia | null> {
    const documento = await DebidaDiligenciaModel.findOne({
      aplicacionCandidatoId
    });

    if (!documento) return null;

    const result: any = {
      id: documento._id.toString(),
      aplicacionCandidatoId: documento.aplicacionCandidatoId.toString(),
      candidatoId: documento.candidatoId.toString(),
      evaluador_id: documento.evaluador_id.toString(),
      nombre_evaluador: documento.nombre_evaluador,
      codigo: documento.codigo,
      version: documento.version,
      fecha_evaluacion: documento.fecha_evaluacion,
      criterios: documento.criterios as Record<string, { ponderacion: number; respuesta: 'SI' | 'NO' | 'NA'; puntaje: number }>,
      puntaje_total: documento.puntaje_total,
      nivel_riesgo: documento.nivel_riesgo,
      created_at: documento.created_at,
      updated_at: documento.updated_at
    };

    if (documento.fecha_aprobacion !== undefined) result.fecha_aprobacion = documento.fecha_aprobacion;
    if (documento.accion !== undefined) result.accion = documento.accion;
    if (documento.controles !== undefined) result.controles = documento.controles.map(control => ({
      criterio: control.criterio,
      responsable: (control.responsable || '').toString(),
      fecha_limite: control.fecha_limite
    }));

    return result as DebidaDiligencia;
  }

  async actualizar(id: string, input: ActualizarDebidaDiligenciaInput): Promise<DebidaDiligencia | null> {
    const documento = await DebidaDiligenciaModel.findById(id);

    if (!documento) return null;

    // Asignar los nuevos valores
    Object.assign(documento, input);
    documento.updated_at = new Date();

    // Guardar para incrementar __v
    await documento.save();

    // Retornar el resultado
    const result: any = {
      id: documento._id.toString(),
      aplicacionCandidatoId: documento.aplicacionCandidatoId.toString(),
      candidatoId: documento.candidatoId.toString(),
      evaluador_id: documento.evaluador_id.toString(),
      nombre_evaluador: documento.nombre_evaluador,
      codigo: documento.codigo,
      version: documento.version,
      fecha_evaluacion: documento.fecha_evaluacion,
      criterios: documento.criterios as Record<string, { ponderacion: number; respuesta: 'SI' | 'NO' | 'NA'; puntaje: number }>,
      puntaje_total: documento.puntaje_total,
      nivel_riesgo: documento.nivel_riesgo,
      created_at: documento.created_at,
      updated_at: documento.updated_at
    };

    if (documento.fecha_aprobacion !== undefined) result.fecha_aprobacion = documento.fecha_aprobacion;
    if (documento.accion !== undefined) result.accion = documento.accion;
    if (documento.controles !== undefined) result.controles = documento.controles.map(control => ({
      criterio: control.criterio,
      responsable: (control.responsable || '').toString(),
      fecha_limite: control.fecha_limite
    }));

    return result as DebidaDiligencia;
  }

  async eliminar(id: string): Promise<boolean> {
    const result = await DebidaDiligenciaModel.findByIdAndDelete(id);
    return !!result;
  }

  async listar(filtros?: {
    aplicacionCandidatoId?: string;
    candidatoId?: string;
    evaluador_id?: string;
    nivel_riesgo?: NivelRiesgo;
    fechaDesde?: Date;
    fechaHasta?: Date;
    limit?: number;
    offset?: number;
  }): Promise<DebidaDiligencia[]> {
    const query: any = {};

    if (filtros?.aplicacionCandidatoId) query.aplicacionCandidatoId = filtros.aplicacionCandidatoId;
    if (filtros?.candidatoId) query.candidatoId = filtros.candidatoId;
    if (filtros?.evaluador_id) query.evaluador_id = filtros.evaluador_id;
    if (filtros?.nivel_riesgo) query.nivel_riesgo = filtros.nivel_riesgo;

    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      query.fecha_evaluacion = {};
      if (filtros.fechaDesde) query.fecha_evaluacion.$gte = filtros.fechaDesde;
      if (filtros.fechaHasta) query.fecha_evaluacion.$lte = filtros.fechaHasta;
    }

    const documentos = await DebidaDiligenciaModel
      .find(query)
      .sort({ created_at: -1 })
      .limit(filtros?.limit || 50)
      .skip(filtros?.offset || 0);

    return documentos.map(documento => {
      const result: any = {
        id: documento._id.toString(),
        aplicacionCandidatoId: documento.aplicacionCandidatoId.toString(),
        candidatoId: documento.candidatoId.toString(),
        evaluador_id: documento.evaluador_id.toString(),
        nombre_evaluador: documento.nombre_evaluador,
        codigo: documento.codigo,
        version: documento.version,
        fecha_evaluacion: documento.fecha_evaluacion,
        criterios: documento.criterios as Record<string, { ponderacion: number; respuesta: 'SI' | 'NO' | 'NA'; puntaje: number }>,
        puntaje_total: documento.puntaje_total,
        nivel_riesgo: documento.nivel_riesgo,
        created_at: documento.created_at,
        updated_at: documento.updated_at
      };

      if (documento.fecha_aprobacion !== undefined) result.fecha_aprobacion = documento.fecha_aprobacion;
      if (documento.accion !== undefined) result.accion = documento.accion;
      if (documento.controles !== undefined) result.controles = documento.controles.map(control => ({
        criterio: control.criterio,
        responsable: (control.responsable || '').toString(),
        fecha_limite: control.fecha_limite
      }));

      return result as DebidaDiligencia;
    });
  }

  async contar(filtros?: {
    aplicacionCandidatoId?: string;
    candidatoId?: string;
    evaluador_id?: string;
    nivel_riesgo?: NivelRiesgo;
    fechaDesde?: Date;
    fechaHasta?: Date;
  }): Promise<number> {
    const query: any = {};

    if (filtros?.aplicacionCandidatoId) query.aplicacionCandidatoId = filtros.aplicacionCandidatoId;
    if (filtros?.candidatoId) query.candidatoId = filtros.candidatoId;
    if (filtros?.evaluador_id) query.evaluador_id = filtros.evaluador_id;
    if (filtros?.nivel_riesgo) query.nivel_riesgo = filtros.nivel_riesgo;

    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      query.fecha_evaluacion = {};
      if (filtros.fechaDesde) query.fecha_evaluacion.$gte = filtros.fechaDesde;
      if (filtros.fechaHasta) query.fecha_evaluacion.$lte = filtros.fechaHasta;
    }

    return await DebidaDiligenciaModel.countDocuments(query);
  }

  async existeParaAplicacion(aplicacionCandidatoId: string): Promise<boolean> {
    const count = await DebidaDiligenciaModel.countDocuments({
      aplicacionCandidatoId
    });
    return count > 0;
  }
}
