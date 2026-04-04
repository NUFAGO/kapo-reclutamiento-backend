import { ComentarioAplicacionModel } from './schemas/ComentarioAplicacionSchema'
import {
  IComentarioAplicacionRepository,
  ComentariosAplicacionListado,
} from '../../../dominio/repositorios/IComentarioAplicacionRepository'
import { ComentarioAplicacion, CrearComentarioAplicacionInput } from '../../../dominio/entidades/ComentarioAplicacion'

export class ComentarioAplicacionMongoRepository implements IComentarioAplicacionRepository {
  private toDomain(doc: any): ComentarioAplicacion {
    return {
      id: doc._id.toString(),
      aplicacionId: String(doc.aplicacionId),
      candidatoId: String(doc.candidatoId),
      texto: doc.texto,
      creadoPor: String(doc.creadoPor),
      creadoPorNombre: doc.creadoPorNombre,
      estadoKanbanContext: doc.estadoKanbanContext,
      created_at: doc.created_at,
    }
  }

  async crear(input: CrearComentarioAplicacionInput): Promise<ComentarioAplicacion> {
    const doc = await ComentarioAplicacionModel.create({
      aplicacionId: input.aplicacionId,
      candidatoId: input.candidatoId,
      texto: input.texto,
      creadoPor: input.creadoPor,
      creadoPorNombre: input.creadoPorNombre,
      estadoKanbanContext: input.estadoKanbanContext,
    })
    return this.toDomain(doc)
  }

  async listarPorAplicacion(
    aplicacionId: string,
    limit = 100,
    offset = 0
  ): Promise<ComentariosAplicacionListado> {
    const [total, docs] = await Promise.all([
      ComentarioAplicacionModel.countDocuments({ aplicacionId }),
      ComentarioAplicacionModel.find({ aplicacionId })
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(Math.min(limit, 200))
        .lean(),
    ])
    return {
      comentarios: docs.map((d) => this.toDomain(d)),
      total,
    }
  }
}
