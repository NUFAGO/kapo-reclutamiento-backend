// ============================================================================
// ENTIDAD DEBIDA DILIGENCIA - Evaluación de debida diligencia al personal
// ============================================================================

export type NivelRiesgo = 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';
export type AccionEvaluacion = 'NO_ESTABLECER' | 'SUSPENDER' | 'TERMINAR' | 'ACEPTAR_CON_CONTROLES';

export interface CriterioEvaluacion {
  ponderacion: number;
  respuesta: 'SI' | 'NO' | 'NA';
  puntaje: number;
}

export interface ControlEvaluacion {
  criterio: string;
  responsable: string;
  fecha_limite: Date;
}

export interface DebidaDiligencia {
  id: string;

  /** Referencias */
  aplicacionCandidatoId: string;
  candidatoId: string;

  /** Información del evaluador */
  evaluador_id: string;
  nombre_evaluador: string;

  /** Información del formato */
  codigo: string;
  version?: number;
  fecha_aprobacion?: Date | undefined;
  fecha_evaluacion: Date;

  /** Criterios de evaluación */
  criterios: Record<string, CriterioEvaluacion>; // e.g., { "item01": { ponderacion: 1, respuesta: "SI", puntaje: 1 } }

  /** Resultados */
  puntaje_total: number;
  nivel_riesgo: NivelRiesgo;
  accion?: AccionEvaluacion;

  /** Controles si se aprueba con controles */
  controles?: ControlEvaluacion[];

  /** Metadata */
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// INPUTS PARA OPERACIONES CRUD
// ============================================================================

export interface CrearDebidaDiligenciaInput {
  aplicacionCandidatoId: string;
  candidatoId: string;
  evaluador_id: string;
  nombre_evaluador: string;
  codigo: string;
  version?: number;
  fecha_aprobacion?: Date;
  fecha_evaluacion: Date;
  criterios: Record<string, CriterioEvaluacion>;
  puntaje_total: number;
  nivel_riesgo: NivelRiesgo;
  accion?: AccionEvaluacion;
  controles?: ControlEvaluacion[];
}

export interface ActualizarDebidaDiligenciaInput {
  evaluador_id?: string;
  nombre_evaluador?: string;
  version?: number;
  fecha_aprobacion?: Date;
  fecha_evaluacion?: Date;
  criterios?: Record<string, CriterioEvaluacion>;
  puntaje_total?: number;
  nivel_riesgo?: NivelRiesgo;
  accion?: AccionEvaluacion;
  controles?: ControlEvaluacion[];
}
