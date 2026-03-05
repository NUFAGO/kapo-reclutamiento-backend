import mongoose, { Schema, Document } from 'mongoose';
import { DisponibilidadViajar, EstadoCivil, ExperienciaRubro } from '../../../../dominio/entidades/EntrevistaLlamada';

export interface EntrevistaLlamadaDocument extends Document {
  aplicacionCandidatoId: mongoose.Types.ObjectId;

  // Información de la entrevista
  fecha_entrevista: Date;

  // Disponibilidad
  disponibilidad_actual: string;
  residencia_actual: string;
  disponibilidad_viajar: DisponibilidadViajar;

  // Información personal
  estudios: string;
  estado_civil: EstadoCivil;
  hijos: number;
  edad: number;

  // Experiencia
  experiencia_general: string;
  experiencia_rubro: ExperienciaRubro;

  // Objetivos profesionales
  busca_estabilidad: string;
  retos_profesionales: string;

  // Evaluación (1-10)
  desenvolvimiento: number;
  interes_puesto: number;

  // Conocimiento del perfil
  conocimiento_perfil: string;

  // Pretensiones salariales
  pretension_monto: number;
  pretension_negociable: string;

  // Información del entrevistador
  comentarios: string;
  solicitar_referencias: string;
  entrevistador_id: mongoose.Types.ObjectId;
  entrevistador_nombre: string;

  // Resultado
  observaciones: string;
  resultado: string;

  // Campos de versionado
  version?: string;
  fecha_version?: string;
  codigo?: string;

  // Nuevos campos opcionales
  motivos_salida_empleo?: string;
  licencia_conducir?: string;
  reporte_infocorp?: string;
  condicion_salud_funciones?: string;
  restriccion_med_funciones?: string;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

const EntrevistaLlamadaSchema = new Schema<EntrevistaLlamadaDocument>({
  aplicacionCandidatoId: {
    type: Schema.Types.ObjectId,
    ref: 'AplicacionCandidato',
    required: true,
    unique: true // Una aplicación solo puede tener una entrevista
  },

  // Información de la entrevista
  fecha_entrevista: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Disponibilidad
  disponibilidad_actual: {
    type: String,
    required: true,
    trim: true
  },
  residencia_actual: {
    type: String,
    required: true,
    trim: true
  },
  disponibilidad_viajar: {
    type: String,
    enum: ['SI', 'NO'],
    required: true
  },

  // Información personal
  estudios: {
    type: String,
    required: true,
    trim: true
  },
  estado_civil: {
    type: String,
    enum: ['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONVIVIENTE'],
    required: true
  },
  hijos: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  edad: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },

  // Experiencia
  experiencia_general: {
    type: String,
    required: true,
    trim: true
  },
  experiencia_rubro: {
    type: String,
    enum: ['BAJO', 'MEDIO', 'ALTO'],
    required: true
  },

  // Objetivos profesionales
  busca_estabilidad: {
    type: String,
    required: true,
    trim: true
  },
  retos_profesionales: {
    type: String,
    required: true,
    trim: true
  },

  // Evaluación (1-10)
  desenvolvimiento: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  interes_puesto: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },

  // Conocimiento del perfil
  conocimiento_perfil: {
    type: String,
    required: true,
    enum: ['SI', 'NO']
  },

  // Pretensiones salariales
  pretension_monto: {
    type: Number,
    required: true,
    min: 0
  },
  pretension_negociable: {
    type: String,
    required: true,
    enum: ['SI', 'NO']
  },

  // Información del entrevistador
  comentarios: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  solicitar_referencias: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  entrevistador_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  entrevistador_nombre: {
    type: String,
    required: true,
    trim: true
  },

  // Resultado
  observaciones: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  resultado: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },

  // Campos de versionado
  version: {
    type: String,
    required: false,
    trim: true
  },
  fecha_version: {
    type: Date,
    required: false
  },
  codigo: {
    type: String,
    required: false,
    trim: true
  },

  // Nuevos campos opcionales
  motivos_salida_empleo: {
    type: String,
    required: false,
    trim: true
  },
  licencia_conducir: {
    type: String,
    required: false,
    trim: true
  },
  reporte_infocorp: {
    type: String,
    required: false,
    trim: true
  },
  condicion_salud_funciones: {
    type: String,
    required: false,
    trim: true
  },
  restriccion_med_funciones: {
    type: String,
    required: false,
    trim: true
  }
}, {
  collection: 'entrevista_llamada',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Índices para búsquedas eficientes
// aplicacionCandidatoId ya tiene índice único por unique: true
EntrevistaLlamadaSchema.index({ entrevistador_id: 1 });
EntrevistaLlamadaSchema.index({ fecha_entrevista: -1 });
EntrevistaLlamadaSchema.index({ created_at: -1 });
EntrevistaLlamadaSchema.index({ estado_civil: 1 });
EntrevistaLlamadaSchema.index({ experiencia_rubro: 1 });
EntrevistaLlamadaSchema.index({ desenvolvimiento: -1 });
EntrevistaLlamadaSchema.index({ interes_puesto: -1 });

export const EntrevistaLlamadaModel = mongoose.model<EntrevistaLlamadaDocument>('EntrevistaLlamada', EntrevistaLlamadaSchema, 'entrevista_llamada');