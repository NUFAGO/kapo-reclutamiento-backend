import mongoose, { Document, Schema } from 'mongoose'
import { ComentarioAplicacion } from '../../../../dominio/entidades/ComentarioAplicacion'

export interface IComentarioAplicacionDocument extends Omit<ComentarioAplicacion, 'id'>, Document {
  _id: mongoose.Types.ObjectId
}

const ESTADOS_KANBAN = [
  'CVS_RECIBIDOS',
  'POR_LLAMAR',
  'ENTREVISTA_PREVIA',
  'PROGRAMAR_1RA_ENTREVISTA',
  'PROGRAMAR_2DA_ENTREVISTA',
  'REFERENCIAS',
  'EVALUACION_ANTISOBORNO',
  'APROBACION_GERENCIA',
  'LLAMAR_COMUNICAR_ENTRADA',
  'FINALIZADA',
  'RECHAZADO_POR_CANDIDATO',
  'DESCARTADO',
  'POSIBLES_CANDIDATOS',
] as const

const ComentarioAplicacionSchema = new Schema<IComentarioAplicacionDocument>(
  {
    aplicacionId: { type: String, required: true, ref: 'AplicacionCandidato', index: true },
    candidatoId: { type: String, required: true, ref: 'Candidato', index: true },
    texto: { type: String, required: true, maxlength: 4000, trim: true },
    creadoPor: { type: String, required: true, index: true },
    creadoPorNombre: { type: String, required: true },
    estadoKanbanContext: {
      type: String,
      enum: ESTADOS_KANBAN,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'comentario_aplicacion',
  }
)

ComentarioAplicacionSchema.index({ aplicacionId: 1, created_at: -1 })

export const ComentarioAplicacionModel = mongoose.model<IComentarioAplicacionDocument>(
  'ComentarioAplicacion',
  ComentarioAplicacionSchema
)
