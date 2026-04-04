import { IResolvers } from '@graphql-tools/utils'
import { ErrorHandler } from './ErrorHandler'
import { ComentarioAplicacionService } from '../../../aplicacion/servicios/ComentarioAplicacionService'

export class ComentarioAplicacionResolver {
  constructor(private readonly service: ComentarioAplicacionService) {}

  getResolvers(): IResolvers {
    return {
      Query: {
        comentariosPorAplicacion: async (
          _: unknown,
          args: { aplicacionId: string; limit?: number; offset?: number }
        ) => {
          return await ErrorHandler.handleError(
            () =>
              this.service.listarPorAplicacion(args.aplicacionId, args.limit ?? undefined, args.offset ?? undefined),
            'comentariosPorAplicacion',
            { aplicacionId: args.aplicacionId }
          )
        },
      },
      Mutation: {
        crearComentarioAplicacion: async (
          _: unknown,
          args: {
            input: {
              aplicacionId: string
              texto: string
              creadoPor: string
              creadoPorNombre: string
              estadoKanbanContext?: string | null
            }
          }
        ) => {
          const i = args.input
          const base = {
            aplicacionId: String(i.aplicacionId),
            texto: String(i.texto),
            creadoPor: String(i.creadoPor),
            creadoPorNombre: String(i.creadoPorNombre),
          }
          const withCtx =
            i.estadoKanbanContext != null && String(i.estadoKanbanContext).length > 0
              ? { ...base, estadoKanbanContext: String(i.estadoKanbanContext) }
              : base
          return await ErrorHandler.handleError(
            () => this.service.crear(withCtx),
            'crearComentarioAplicacion',
            { aplicacionId: i.aplicacionId }
          )
        },
      },
    }
  }
}
