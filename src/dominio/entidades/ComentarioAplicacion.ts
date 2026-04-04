// ============================================================================
// ENTIDAD - Comentarios libres por aplicación (Kanban)
// ============================================================================

export interface ComentarioAplicacion {
  id: string
  aplicacionId: string
  candidatoId: string
  texto: string
  creadoPor: string
  creadoPorNombre: string
  /** Etapa del Kanban en la que se redactó (opcional, para contexto en historial). */
  estadoKanbanContext?: string
  created_at: Date
}

export interface CrearComentarioAplicacionInput {
  aplicacionId: string
  candidatoId: string
  texto: string
  creadoPor: string
  creadoPorNombre: string
  estadoKanbanContext?: string
}
