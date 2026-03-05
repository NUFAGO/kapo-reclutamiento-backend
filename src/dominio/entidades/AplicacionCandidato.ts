// ============================================================================
// ENTIDAD APLICACION CANDIDATO - Aplicación específica a una convocatoria
// ============================================================================
// para deploy 
import { EstadoKanban } from './EstadoKanban';

export interface AplicacionCandidato {
  id: string;
  candidatoId: string;
  convocatoriaId: string;

  /** Respuestas del formulario dinámico (CAMPOS PERSONALIZADOS) */
  respuestasFormulario: Record<string, unknown>;

  /** Estado en el flujo del Kanban (13 estados) */
  estadoKanban: EstadoKanban;

  /** Información específica de esta postulación */
  aniosExperienciaPuesto: number;
  aniosExperienciaGeneral?: number;
  medioConvocatoria?: string;
  pretensionEconomica: number;
  curriculumUrl: string;

  /** Metadata de la aplicación */
  fechaAplicacion: Date;
  aplicadoPor: 'CANDIDATO' | 'RECLUTADOR';

  /** Campos para sistema de posibles candidatos */
  ordenPrioridad?: number; // Para columna POSIBLES_CANDIDATOS
  fechaExpiracionPosibles?: Date; // +6 meses

  /** Detección de duplicados */
  posibleDuplicado: boolean;
  candidatoSimilarId?: string;
  similitudPorcentaje?: number;
  duplicadoRevisado: boolean;

  /** Tracking de reactivaciones */
  esRepostulacion: boolean;
  esPosibleCandidatoActivado: boolean;
  aplicacionPrincipalRechazadaId?: string;

  /** Metadata adicional */
  fechaActualizacion?: Date;
  tiempoEnEstadoDias?: number;

  /** Estado del proceso de finalización */
  procesoFinalizadoCompleto?: boolean; // Campo específico para saber si concluyó todo el proceso
  fechaFinalizacionProceso?: Date; // Fecha exacta cuando se completó el proceso

  /** Campos desnormalizados para performance (lookup) */
  candidato_nombres?: string;
  candidato_apellidos?: string;
  candidato_correo?: string;
  candidato_telefono?: string;
  convocatoria_cargo_nombre?: string;
  convocatoria_obra_nombre?: string;
  convocatoria_empresa_nombre?: string;
}

export interface CrearAplicacionInput {
  candidatoId: string;
  convocatoriaId: string;
  respuestasFormulario: Record<string, unknown>;
  aplicadoPor?: 'CANDIDATO' | 'RECLUTADOR';
  aniosExperienciaPuesto?: number;
  aniosExperienciaGeneral?: number;
  medioConvocatoria?: string;
  pretensionEconomica?: number;
  curriculumUrl?: string;
}

export interface ActualizarAplicacionInput {
  aniosExperienciaPuesto?: number;
  aniosExperienciaGeneral?: number;
  medioConvocatoria?: string;
  pretensionEconomica?: number;
  curriculumUrl?: string;
  respuestasFormulario?: Record<string, unknown>;
  estadoKanban?: EstadoKanban;
  ordenPrioridad?: number;
  fechaExpiracionPosibles?: Date;
  posibleDuplicado?: boolean;
  candidatoSimilarId?: string;
  similitudPorcentaje?: number;
  duplicadoRevisado?: boolean;
  esRepostulacion?: boolean;
  esPosibleCandidatoActivado?: boolean;
  aplicacionPrincipalRechazadaId?: string;
  convocatoriaId?: string;
  procesoFinalizadoCompleto?: boolean;
  fechaFinalizacionProceso?: Date;
}