// ============================================================================
// ESTADO KANBAN - Estados del proceso de selección (13 columnas)
// ============================================================================

export enum EstadoKanban {
  // 1. Recepción de CVs
  CVS_RECIBIDOS = 'CVS_RECIBIDOS',

  // 2. Evaluación inicial
  POR_LLAMAR = 'POR_LLAMAR',
  ENTREVISTA_PREVIA = 'ENTREVISTA_PREVIA',

  // 3. Referencias
  REFERENCIAS = 'REFERENCIAS',

  // 4. Programación de entrevistas
  PROGRAMAR_1RA_ENTREVISTA = 'PROGRAMAR_1RA_ENTREVISTA',
  PROGRAMAR_2DA_ENTREVISTA = 'PROGRAMAR_2DA_ENTREVISTA',

  // 5. Evaluación profunda
  EVALUACION_ANTISOBORNO = 'EVALUACION_ANTISOBORNO',

  // 5. Aprobaciones finales
  APROBACION_GERENCIA = 'APROBACION_GERENCIA',
  LLAMAR_COMUNICAR_ENTRADA = 'LLAMAR_COMUNICAR_ENTRADA',

  // 6. Estados finales
  FINALIZADA = 'FINALIZADA',
  RECHAZADO_POR_CANDIDATO = 'RECHAZADO_POR_CANDIDATO',
  DESCARTADO = 'DESCARTADO',
  POSIBLES_CANDIDATOS = 'POSIBLES_CANDIDATOS'
}

// Estados por los que puede pasar una aplicación
export const ESTADOS_KANBAN_VALIDOS = Object.values(EstadoKanban);

// Función helper para validar transiciones
export function esTransicionValida(estadoActual: EstadoKanban, estadoNuevo: EstadoKanban): boolean {
  const transicionesValidas: Partial<Record<EstadoKanban, readonly EstadoKanban[]>> = {
    [EstadoKanban.CVS_RECIBIDOS]: [EstadoKanban.POR_LLAMAR, EstadoKanban.DESCARTADO],
    [EstadoKanban.POR_LLAMAR]: [EstadoKanban.ENTREVISTA_PREVIA, EstadoKanban.DESCARTADO],
    [EstadoKanban.ENTREVISTA_PREVIA]: [EstadoKanban.REFERENCIAS, EstadoKanban.DESCARTADO],
    [EstadoKanban.REFERENCIAS]: [EstadoKanban.PROGRAMAR_1RA_ENTREVISTA, EstadoKanban.DESCARTADO],
    [EstadoKanban.PROGRAMAR_1RA_ENTREVISTA]: [EstadoKanban.PROGRAMAR_2DA_ENTREVISTA, EstadoKanban.POSIBLES_CANDIDATOS, EstadoKanban.DESCARTADO],
    [EstadoKanban.PROGRAMAR_2DA_ENTREVISTA]: [EstadoKanban.EVALUACION_ANTISOBORNO, EstadoKanban.POSIBLES_CANDIDATOS, EstadoKanban.DESCARTADO],
    [EstadoKanban.EVALUACION_ANTISOBORNO]: [EstadoKanban.APROBACION_GERENCIA, EstadoKanban.POSIBLES_CANDIDATOS, EstadoKanban.DESCARTADO],
    [EstadoKanban.APROBACION_GERENCIA]: [EstadoKanban.LLAMAR_COMUNICAR_ENTRADA, EstadoKanban.POSIBLES_CANDIDATOS, EstadoKanban.DESCARTADO],
    [EstadoKanban.LLAMAR_COMUNICAR_ENTRADA]: [EstadoKanban.FINALIZADA, EstadoKanban.RECHAZADO_POR_CANDIDATO, EstadoKanban.DESCARTADO],
    [EstadoKanban.FINALIZADA]: [], // Estado final
    [EstadoKanban.RECHAZADO_POR_CANDIDATO]: [EstadoKanban.POSIBLES_CANDIDATOS], // Puede reactivarse
    [EstadoKanban.DESCARTADO]: [], // Estado final
    [EstadoKanban.POSIBLES_CANDIDATOS]: [EstadoKanban.PROGRAMAR_1RA_ENTREVISTA] // Puede reactivarse
  };

  return transicionesValidas[estadoActual]!.includes(estadoNuevo);
}