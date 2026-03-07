import mongoose, { Schema, Document } from 'mongoose';
import { NivelRiesgo, AccionEvaluacion } from '../../../../dominio/entidades/DebidaDiligencia';

export interface DebidaDiligenciaDocument extends Document {
  aplicacionCandidatoId: mongoose.Types.ObjectId;
  candidatoId: mongoose.Types.ObjectId;
  evaluador_id: mongoose.Types.ObjectId;
  nombre_evaluador: string;
  codigo: string;
  version?: number;
  fecha_aprobacion?: Date | undefined;
  fecha_evaluacion: Date;
  criterios: Record<string, { ponderacion: number; respuesta: string; puntaje: number }>;
  puntaje_total: number;
  nivel_riesgo: NivelRiesgo;
  accion?: AccionEvaluacion | undefined;
  controles?: Array<{ criterio: string; responsable: string; fecha_limite: Date }>;
  created_at: Date;
  updated_at: Date;
}

const ControlSchema = new Schema({
  criterio: { type: String, required: true },
  responsable: { type: String, required: true },
  fecha_limite: { type: Date, required: true }
}, { _id: false });

const DebidaDiligenciaSchema = new Schema<DebidaDiligenciaDocument>({
  aplicacionCandidatoId: {
    type: Schema.Types.ObjectId,
    ref: 'AplicacionCandidato',
    required: true
  },

  candidatoId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidato',
    required: true
  },

  evaluador_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  nombre_evaluador: {
    type: String,
    required: true,
    trim: true
  },

  codigo: {
    type: String,
    required: true,
    trim: true
  },

  version: {
    type: Number,
    required: false,
    default: 1
  },

  fecha_aprobacion: {
    type: Date,
    required: false
  },

  fecha_evaluacion: {
    type: Date,
    required: true
  },

  criterios: {
    type: Schema.Types.Mixed,
    required: true
  },

  puntaje_total: {
    type: Number,
    required: true
  },

  nivel_riesgo: {
    type: String,
    enum: ['BAJO', 'MODERADO', 'ALTO', 'CRITICO'],
    required: true
  },

  accion: {
    type: String,
    enum: ['TERMINAR', 'ACEPTAR_CON_CONTROLES', 'ACEPTAR'],
    required: false
  },

  controles: [ControlSchema]
}, {
  collection: 'debida_diligencia',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Índices para búsquedas eficientes
DebidaDiligenciaSchema.index(
  { aplicacionCandidatoId: 1 },
  { unique: true }
);
DebidaDiligenciaSchema.index({ candidatoId: 1 });
DebidaDiligenciaSchema.index({ evaluador_id: 1 });
DebidaDiligenciaSchema.index({ fecha_evaluacion: -1 });
DebidaDiligenciaSchema.index({ nivel_riesgo: 1 });
DebidaDiligenciaSchema.index({ created_at: -1 });

export const DebidaDiligenciaModel = mongoose.model<DebidaDiligenciaDocument>('DebidaDiligencia', DebidaDiligenciaSchema, 'debida_diligencia');
