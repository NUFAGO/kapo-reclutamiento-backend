// ============================================================================
// ENTIDAD CONVOCATORIA - Recibida desde MS PERSONAL (snapshot desnormalizado)
// ============================================================================

export type TipoRequerimientoConvocatoria = 'obra' | 'staff';
export type EstadoConvocatoria = 'ACTIVA' | 'EN_PROCESO' | 'FINALIZADA' | 'CANCELADA';

export interface Convocatoria {
  id: string;
  /** ID del requerimiento en MS PERSONAL (mismo id para buscar/actualizar entre las dos DB) */
  requerimiento_personal_id: string;
  codigo_convocatoria: string;
  tipo_requerimiento: TipoRequerimientoConvocatoria;
  estado_convocatoria: EstadoConvocatoria;
  /** Snapshot: no consultar MS PERSONAL (cargo, categoría y especialidad por separado) */
  cargo_nombre?: string;
  categoria_nombre?: string;
  especialidad_nombre?: string;
  obra_nombre?: string;
  empresa_nombre?: string;
  vacantes: number;
  prioridad: string;
  requisitos?: Record<string, unknown>;
  cargo_categoria_especialidad_id?: string;
  obra_id?: string;
  empresa_id?: string;
  /** Snapshot Staff (solo cuando tipo_requerimiento === 'staff') */
  detalle_staff_snapshot?: Record<string, unknown>;
  link_formulario?: string;
  token_formulario?: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  ganadores_ids: string[];
}

export interface RecibirConvocatoriaInput {
  requerimiento_personal_id: string;
  codigo_convocatoria: string;
  tipo_requerimiento: TipoRequerimientoConvocatoria;
  cargo_nombre?: string;
  categoria_nombre?: string;
  especialidad_nombre?: string;
  obra_nombre?: string;
  empresa_nombre?: string;
  vacantes: number;
  prioridad: string;
  requisitos?: Record<string, unknown>;
  cargo_categoria_especialidad_id?: string;
  obra_id?: string;
  empresa_id?: string;
  detalle_staff_snapshot?: Record<string, unknown>;
  ganadores_ids?: string[];
}

export interface ConvocatoriaFilters {
  _id?: string;
  cargo_nombre?: string;
  categoria_nombre?: string;
  especialidad_nombre?: string;
  codigo_convocatoria?: string;
  estado_convocatoria?: EstadoConvocatoria;
}
