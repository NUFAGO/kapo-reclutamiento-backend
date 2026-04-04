import { ComentarioAplicacion, CrearComentarioAplicacionInput } from '../entidades/ComentarioAplicacion';

export interface ComentariosAplicacionListado {
  comentarios: ComentarioAplicacion[]
  total: number
}

export interface IComentarioAplicacionRepository {
  crear(input: CrearComentarioAplicacionInput): Promise<ComentarioAplicacion>
  listarPorAplicacion(aplicacionId: string, limit?: number, offset?: number): Promise<ComentariosAplicacionListado>
}
