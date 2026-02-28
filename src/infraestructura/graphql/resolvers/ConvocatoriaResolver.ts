// ============================================================================
// RESOLVER CONVOCATORIA - Queries y mutation recibirConvocatoria
// ============================================================================

import { IResolvers } from '@graphql-tools/utils';
import { ConvocatoriaService } from '../../../aplicacion/servicios/ConvocatoriaService';
import { RecibirConvocatoriaInput, ConvocatoriaFilters } from '../../../dominio/entidades/Convocatoria';
import { ErrorHandler } from './ErrorHandler';

export class ConvocatoriaResolver {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  getResolvers(): IResolvers {
    return {
      Query: {
        convocatoria: async (_: unknown, args: { id: string }) => {
          return await ErrorHandler.handleError(
            async () => await this.convocatoriaService.getById(args.id),
            'convocatoria',
            { id: args.id }
          );
        },
        convocatoriaPorRequerimientoPersonalId: async (_: unknown, args: { requerimientoPersonalId: string }) => {
          return await ErrorHandler.handleError(
            async () => await this.convocatoriaService.getByRequerimientoPersonalId(args.requerimientoPersonalId),
            'convocatoriaPorRequerimientoPersonalId',
            { requerimientoPersonalId: args.requerimientoPersonalId }
          );
        },
        convocatorias: async (_: unknown, args: { limit?: number; offset?: number; filters?: ConvocatoriaFilters }) => {
          return await ErrorHandler.handleError(
            async () => await this.convocatoriaService.list(args.limit, args.offset, args.filters),
            'convocatorias'
          );
        },
      },
      Mutation: {
        recibirConvocatoria: async (_: unknown, args: { input: RecibirConvocatoriaInput }) => {
          return await ErrorHandler.handleError(
            async () => await this.convocatoriaService.recibirConvocatoria(args.input),
            'recibirConvocatoria'
          );
        },
      },
    };
  }
}
