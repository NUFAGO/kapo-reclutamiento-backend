// ============================================================================
// ENTIDAD ENTREVISTA LLAMADA - Registro de entrevistas telefónicas iniciales
// ============================================================================

export type DisponibilidadViajar = 'SI' | 'NO';
export type EstadoCivil = 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO' | 'CONVIVIENTE';
export type ExperienciaRubro = 'BAJO' | 'MEDIO' | 'ALTO';

export interface EntrevistaLlamada {
  id: string;

  /** ID de la aplicación candidata relacionada */
  aplicacionCandidatoId: string;

  /** Información de la entrevista */
  fecha_entrevista: Date;

  /** Disponibilidad inmediata */
  disponibilidad_actual: string;

  /** Residencia actual */
  residencia_actual: string;

  /** Disponibilidad para viajar */
  disponibilidad_viajar: DisponibilidadViajar;

  /** Estudios */
  estudios: string;

  /** Estado civil */
  estado_civil: EstadoCivil;

  /** Número de hijos */
  hijos: number;

  /** Edad del candidato */
  edad: number;

  /** Experiencia general */
  experiencia_general: string;

  /** Experiencia en el rubro */
  experiencia_rubro: ExperienciaRubro;

  /** Busca estabilidad laboral */
  busca_estabilidad: string;

  /** Retos profesionales */
  retos_profesionales: string;

  /** Calificación de desenvolvimiento (1-10) */
  desenvolvimiento: number;

  /** Conocimiento del perfil */
  conocimiento_perfil: 'SI' | 'NO';

  /** Interés en el puesto (1-10) */
  interes_puesto: number;

  /** Pretensiones salariales */
  pretension_monto: number;
  pretension_negociable: 'SI' | 'NO';

  /** Comentarios del entrevistador */
  comentarios?: string;

  /** Solicitar referencias */
  solicitar_referencias?: string;

  /** Información del entrevistador */
  entrevistador_id: string;
  entrevistador_nombre: string;

  /** Observaciones adicionales */
  observaciones: string;

  /** Resultado final de la entrevista */
  resultado: string;

  /** Campos de versionado */
  version?: string;
  fecha_version?: Date;
  codigo?: string;

  /** Nuevos campos opcionales */
  motivos_salida_empleo?: string;
  licencia_conducir?: string;
  reporte_infocorp?: string;
  condicion_salud_funciones?: string;
  restriccion_med_funciones?: string;

  /** Metadata */
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// INPUTS PARA OPERACIONES CRUD
// ============================================================================

export interface CrearEntrevistaInput {
  aplicacionCandidatoId: string;
  fecha_entrevista: Date;
  disponibilidad_actual: string;
  residencia_actual: string;
  disponibilidad_viajar: DisponibilidadViajar;
  estudios: string;
  estado_civil: EstadoCivil;
  hijos: number;
  edad: number;
  experiencia_general: string;
  experiencia_rubro: ExperienciaRubro;
  busca_estabilidad: string;
  retos_profesionales: string;
  desenvolvimiento: number;
  conocimiento_perfil: 'SI' | 'NO';
  interes_puesto: number;
  pretension_monto: number;
  pretension_negociable: 'SI' | 'NO';
  comentarios?: string;
  solicitar_referencias?: string;
  entrevistador_id: string;
  entrevistador_nombre: string;
  observaciones: string;
  resultado: string;
  version?: string;
  fecha_version?: Date;
  codigo?: string;
  motivos_salida_empleo?: string;
  licencia_conducir?: string;
  reporte_infocorp?: string;
  condicion_salud_funciones?: string;
  restriccion_med_funciones?: string;
}

export interface ActualizarEntrevistaInput {
  aplicacionCandidatoId?: string;
  fecha_entrevista?: Date;
  disponibilidad_actual?: string;
  residencia_actual?: string;
  disponibilidad_viajar?: DisponibilidadViajar;
  estudios?: string;
  estado_civil?: EstadoCivil;
  hijos?: number;
  edad?: number;
  experiencia_general?: string;
  experiencia_rubro?: ExperienciaRubro;
  busca_estabilidad?: string;
  retos_profesionales?: string;
  desenvolvimiento?: number;
  conocimiento_perfil?: 'SI' | 'NO';
  interes_puesto?: number;
  pretension_monto?: number;
  pretension_negociable?: 'SI' | 'NO';
  comentarios?: string;
  solicitar_referencias?: string;
  entrevistador_id?: string;
  entrevistador_nombre?: string;
  observaciones?: string;
  resultado?: string;
  version?: string;
  fecha_version?: Date;
  codigo?: string;
  motivos_salida_empleo?: string;
  licencia_conducir?: string;
  reporte_infocorp?: string;
  condicion_salud_funciones?: string;
  restriccion_med_funciones?: string;
}