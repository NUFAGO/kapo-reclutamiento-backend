import { ValidationException } from '../../dominio/exceptions/DomainException'
import { IComentarioAplicacionRepository } from '../../dominio/repositorios/IComentarioAplicacionRepository'
import { IAplicacionCandidatoRepository } from '../../dominio/repositorios/IAplicacionCandidatoRepository'
import {
  ComentarioAplicacion,
  CrearComentarioAplicacionInput,
} from '../../dominio/entidades/ComentarioAplicacion'
import { ComentariosAplicacionListado } from '../../dominio/repositorios/IComentarioAplicacionRepository'

const MAX_TEXTO = 4000

export interface CrearComentarioAplicacionServiceInput {
  aplicacionId: string
  texto: string
  creadoPor: string
  creadoPorNombre: string
  estadoKanbanContext?: string
}

export class ComentarioAplicacionService {
  constructor(
    private readonly comentarioRepo: IComentarioAplicacionRepository,
    private readonly aplicacionRepo: IAplicacionCandidatoRepository
  ) {}

  async crear(input: CrearComentarioAplicacionServiceInput): Promise<ComentarioAplicacion> {
    const texto = input.texto?.trim() ?? ''
    if (!texto) {
      throw new ValidationException('El comentario no puede estar vacío', 'texto')
    }
    if (texto.length > MAX_TEXTO) {
      throw new ValidationException(`El comentario no puede superar ${MAX_TEXTO} caracteres`, 'texto')
    }

    const aplicacion = await this.aplicacionRepo.obtenerPorId(input.aplicacionId)
    if (!aplicacion) {
      throw new ValidationException('Aplicación no encontrada', 'aplicacionId')
    }

    const payload: CrearComentarioAplicacionInput = {
      aplicacionId: input.aplicacionId,
      candidatoId: aplicacion.candidatoId,
      texto,
      creadoPor: input.creadoPor,
      creadoPorNombre: input.creadoPorNombre,
    }
    if (input.estadoKanbanContext != null && input.estadoKanbanContext !== '') {
      payload.estadoKanbanContext = input.estadoKanbanContext
    }
    return await this.comentarioRepo.crear(payload)
  }

  async listarPorAplicacion(
    aplicacionId: string,
    limit?: number,
    offset?: number
  ): Promise<ComentariosAplicacionListado> {
    return await this.comentarioRepo.listarPorAplicacion(aplicacionId, limit, offset)
  }
}
