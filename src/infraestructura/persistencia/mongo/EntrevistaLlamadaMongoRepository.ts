// ============================================================================
// REPOSITORIO MONGODB PARA ENTREVISTAS DE LLAMADA
// ============================================================================

import { EntrevistaLlamadaModel } from './schemas/EntrevistaLlamadaSchema';
import { BaseMongoRepository } from './BaseMongoRepository';
import { IEntrevistaLlamadaRepository } from '../../../dominio/repositorios/IEntrevistaLlamadaRepository';
import { EntrevistaLlamada, CrearEntrevistaInput, ActualizarEntrevistaInput } from '../../../dominio/entidades/EntrevistaLlamada';

/**
 * Repositorio MongoDB para la gestión de entrevistas telefónicas iniciales
 * Implementa la interfaz IEntrevistaLlamadaRepository
 */
export class EntrevistaLlamadaMongoRepository extends BaseMongoRepository<EntrevistaLlamada> implements IEntrevistaLlamadaRepository {
  constructor() {
    super(EntrevistaLlamadaModel);
  }

  /**
   * Convierte documento de MongoDB a entidad de dominio
   */
  protected toDomain(doc: any): EntrevistaLlamada {
    return {
      id: doc._id.toString(),
      aplicacionCandidatoId: doc.aplicacionCandidatoId.toString(),

      // Información de la entrevista
      fecha_entrevista: doc.fecha_entrevista,

      // Disponibilidad
      disponibilidad_actual: doc.disponibilidad_actual,
      residencia_actual: doc.residencia_actual,
      disponibilidad_viajar: doc.disponibilidad_viajar,

      // Información personal
      estudios: doc.estudios,
      estado_civil: doc.estado_civil,
      hijos: doc.hijos,
      edad: doc.edad,

      // Experiencia
      experiencia_general: doc.experiencia_general,
      experiencia_rubro: doc.experiencia_rubro,

      // Objetivos profesionales
      busca_estabilidad: doc.busca_estabilidad,
      retos_profesionales: doc.retos_profesionales,

      // Evaluación (1-10)
      desenvolvimiento: doc.desenvolvimiento,
      interes_puesto: doc.interes_puesto,

      // Conocimiento del perfil
      conocimiento_perfil: doc.conocimiento_perfil,

      // Pretensiones salariales
      pretension_monto: doc.pretension_monto,
      pretension_negociable: doc.pretension_negociable,

      // Información del entrevistador
      comentarios: doc.comentarios,
      solicitar_referencias: doc.solicitar_referencias,
      entrevistador_id: doc.entrevistador_id.toString(),
      entrevistador_nombre: doc.entrevistador_nombre,

      // Resultado
      observaciones: doc.observaciones,
      resultado: doc.resultado,

      // Campos de versionado
      version: doc.version,
      fecha_version: doc.fecha_version,
      codigo: doc.codigo,

      // Nuevos campos opcionales
      motivos_salida_empleo: doc.motivos_salida_empleo,
      licencia_conducir: doc.licencia_conducir,
      reporte_infocorp: doc.reporte_infocorp,
      condicion_salud_funciones: doc.condicion_salud_funciones,
      restriccion_med_funciones: doc.restriccion_med_funciones,

      // Metadata
      created_at: doc.created_at,
      updated_at: doc.updated_at
    };
  }

  /**
   * Crear una nueva entrevista de llamada
   */
  async crear(entrevista: CrearEntrevistaInput): Promise<EntrevistaLlamada> {
    const doc = await this.model.create({
      aplicacionCandidatoId: entrevista.aplicacionCandidatoId,
      fecha_entrevista: entrevista.fecha_entrevista,
      disponibilidad_actual: entrevista.disponibilidad_actual,
      residencia_actual: entrevista.residencia_actual,
      disponibilidad_viajar: entrevista.disponibilidad_viajar,
      estudios: entrevista.estudios,
      estado_civil: entrevista.estado_civil,
      hijos: entrevista.hijos,
      edad: entrevista.edad,
      experiencia_general: entrevista.experiencia_general,
      experiencia_rubro: entrevista.experiencia_rubro,
      busca_estabilidad: entrevista.busca_estabilidad,
      retos_profesionales: entrevista.retos_profesionales,
      desenvolvimiento: entrevista.desenvolvimiento,
      conocimiento_perfil: entrevista.conocimiento_perfil,
      interes_puesto: entrevista.interes_puesto,
      pretension_monto: entrevista.pretension_monto,
      pretension_negociable: entrevista.pretension_negociable,
      comentarios: entrevista.comentarios,
      solicitar_referencias: entrevista.solicitar_referencias,
      entrevistador_id: entrevista.entrevistador_id,
      entrevistador_nombre: entrevista.entrevistador_nombre,
      observaciones: entrevista.observaciones,
      resultado: entrevista.resultado,
      // Campos de versionado
      version: entrevista.version,
      fecha_version: entrevista.fecha_version,
      codigo: entrevista.codigo,
      // Nuevos campos opcionales
      motivos_salida_empleo: entrevista.motivos_salida_empleo,
      licencia_conducir: entrevista.licencia_conducir,
      reporte_infocorp: entrevista.reporte_infocorp,
      condicion_salud_funciones: entrevista.condicion_salud_funciones,
      restriccion_med_funciones: entrevista.restriccion_med_funciones
    });

    return this.toDomain(doc);
  }

  /**
   * Obtener entrevista por aplicación candidata
   */
  async obtenerPorAplicacionCandidatoId(aplicacionCandidatoId: string): Promise<EntrevistaLlamada | null> {
    const doc = await this.model.findOne({ aplicacionCandidatoId }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  /**
   * Actualizar entrevista existente
   */
  async actualizar(id: string, entrevista: ActualizarEntrevistaInput): Promise<EntrevistaLlamada | null> {
    const updateData: any = {};

    // Solo incluir campos que no son undefined
    if (entrevista.fecha_entrevista !== undefined) updateData.fecha_entrevista = entrevista.fecha_entrevista;
    if (entrevista.disponibilidad_actual !== undefined) updateData.disponibilidad_actual = entrevista.disponibilidad_actual;
    if (entrevista.residencia_actual !== undefined) updateData.residencia_actual = entrevista.residencia_actual;
    if (entrevista.disponibilidad_viajar !== undefined) updateData.disponibilidad_viajar = entrevista.disponibilidad_viajar;
    if (entrevista.estudios !== undefined) updateData.estudios = entrevista.estudios;
    if (entrevista.estado_civil !== undefined) updateData.estado_civil = entrevista.estado_civil;
    if (entrevista.hijos !== undefined) updateData.hijos = entrevista.hijos;
    if (entrevista.edad !== undefined) updateData.edad = entrevista.edad;
    if (entrevista.experiencia_general !== undefined) updateData.experiencia_general = entrevista.experiencia_general;
    if (entrevista.experiencia_rubro !== undefined) updateData.experiencia_rubro = entrevista.experiencia_rubro;
    if (entrevista.busca_estabilidad !== undefined) updateData.busca_estabilidad = entrevista.busca_estabilidad;
    if (entrevista.retos_profesionales !== undefined) updateData.retos_profesionales = entrevista.retos_profesionales;
    if (entrevista.desenvolvimiento !== undefined) updateData.desenvolvimiento = entrevista.desenvolvimiento;
    if (entrevista.conocimiento_perfil !== undefined) updateData.conocimiento_perfil = entrevista.conocimiento_perfil;
    if (entrevista.interes_puesto !== undefined) updateData.interes_puesto = entrevista.interes_puesto;
    if (entrevista.pretension_monto !== undefined) updateData.pretension_monto = entrevista.pretension_monto;
    if (entrevista.pretension_negociable !== undefined) updateData.pretension_negociable = entrevista.pretension_negociable;
    if (entrevista.comentarios !== undefined) updateData.comentarios = entrevista.comentarios;
    if (entrevista.solicitar_referencias !== undefined) updateData.solicitar_referencias = entrevista.solicitar_referencias;
    if (entrevista.entrevistador_id !== undefined) updateData.entrevistador_id = entrevista.entrevistador_id;
    if (entrevista.entrevistador_nombre !== undefined) updateData.entrevistador_nombre = entrevista.entrevistador_nombre;
    if (entrevista.observaciones !== undefined) updateData.observaciones = entrevista.observaciones;
    if (entrevista.resultado !== undefined) updateData.resultado = entrevista.resultado;
    // Campos de versionado
    if (entrevista.version !== undefined) updateData.version = entrevista.version;
    if (entrevista.fecha_version !== undefined) updateData.fecha_version = entrevista.fecha_version;
    if (entrevista.codigo !== undefined) updateData.codigo = entrevista.codigo;
    // Nuevos campos opcionales
    if (entrevista.motivos_salida_empleo !== undefined) updateData.motivos_salida_empleo = entrevista.motivos_salida_empleo;
    if (entrevista.licencia_conducir !== undefined) updateData.licencia_conducir = entrevista.licencia_conducir;
    if (entrevista.reporte_infocorp !== undefined) updateData.reporte_infocorp = entrevista.reporte_infocorp;
    if (entrevista.condicion_salud_funciones !== undefined) updateData.condicion_salud_funciones = entrevista.condicion_salud_funciones;
    if (entrevista.restriccion_med_funciones !== undefined) updateData.restriccion_med_funciones = entrevista.restriccion_med_funciones;

    const doc = await this.model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();

    return doc ? this.toDomain(doc) : null;
  }

  /**
   * Listar entrevistas con filtros opcionales
   */
  async listar(filtros?: {
    aplicacionCandidatoId?: string;
    entrevistador_id?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    limit?: number;
    offset?: number;
  }): Promise<EntrevistaLlamada[]> {
    const query: any = {};

    if (filtros?.aplicacionCandidatoId) {
      query.aplicacionCandidatoId = filtros.aplicacionCandidatoId;
    }

    if (filtros?.entrevistador_id) {
      query.entrevistador_id = filtros.entrevistador_id;
    }

    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      query.fecha_entrevista = {};
      if (filtros.fechaDesde) {
        query.fecha_entrevista.$gte = filtros.fechaDesde;
      }
      if (filtros.fechaHasta) {
        query.fecha_entrevista.$lte = filtros.fechaHasta;
      }
    }

    const docs = await this.model
      .find(query)
      .sort({ created_at: -1 })
      .limit(filtros?.limit || 50)
      .skip(filtros?.offset || 0)
      .exec();

    return docs.map(doc => this.toDomain(doc));
  }

  /**
   * Contar entrevistas con filtros
   */
  async contar(filtros?: {
    aplicacionCandidatoId?: string;
    entrevistador_id?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
  }): Promise<number> {
    const query: any = {};

    if (filtros?.aplicacionCandidatoId) {
      query.aplicacionCandidatoId = filtros.aplicacionCandidatoId;
    }

    if (filtros?.entrevistador_id) {
      query.entrevistador_id = filtros.entrevistador_id;
    }

    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      query.fecha_entrevista = {};
      if (filtros.fechaDesde) {
        query.fecha_entrevista.$gte = filtros.fechaDesde;
      }
      if (filtros.fechaHasta) {
        query.fecha_entrevista.$lte = filtros.fechaHasta;
      }
    }

    return this.model.countDocuments(query).exec();
  }

  /**
   * Obtener entrevista por ID
   */
  async obtenerPorId(id: string): Promise<EntrevistaLlamada | null> {
    return this.findById(id);
  }

  /**
   * Eliminar entrevista
   */
  async eliminar(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error('Error eliminando entrevista:', error);
      return false;
    }
  }

  /**
   * Verificar si existe entrevista para una aplicación candidata
   */
  async existeParaAplicacionCandidato(aplicacionCandidatoId: string): Promise<boolean> {
    const count = await this.model.countDocuments({ aplicacionCandidatoId }).exec();
    return count > 0;
  }
}