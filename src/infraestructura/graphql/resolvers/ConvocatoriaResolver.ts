// ============================================================================
// RESOLVER CONVOCATORIA - Queries y mutation recibirConvocatoria
// ============================================================================

import { IResolvers } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';
import { ConvocatoriaService } from '../../../aplicacion/servicios/ConvocatoriaService';
import { FormularioConfigService } from '../../../aplicacion/servicios/FormularioConfigService';
import { RecibirConvocatoriaInput, ConvocatoriaFilters } from '../../../dominio/entidades/Convocatoria';
import { ErrorHandler } from './ErrorHandler';

export class ConvocatoriaResolver {
  constructor(
    private readonly convocatoriaService: ConvocatoriaService,
    private readonly formularioConfigService: FormularioConfigService
  ) {}

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
        recibirConvocatoria: async (
          _: unknown,
          args: { input: RecibirConvocatoriaInput },
          context: { req?: { headers?: Record<string, string | string[] | undefined> } }
        ) => {
          const secret = process.env['RECIBIR_CONVOCATORIA_SECRET']?.trim();
          if (secret) {
            const headers = context?.req?.headers ?? {};
            const headerVal = (name: string): string | undefined => {
              const v = headers[name.toLowerCase()];
              return Array.isArray(v) ? v[0] : v;
            };
            const sent =
              headerVal('x-recibir-convocatoria-secret') ?? headerVal('x-recibir-convocatoria-key');
            if (sent !== secret) {
              throw new GraphQLError('No autorizado: sincronización de convocatoria (MS Personal)', {
                extensions: { code: 'FORBIDDEN' },
              });
            }
          }
          return await ErrorHandler.handleError(
            async () => await this.convocatoriaService.recibirConvocatoria(args.input),
            'recibirConvocatoria'
          );
        },
      },
      Convocatoria: {
        formularioConfig: async (parent: { id: string }) => {
          return await ErrorHandler.handleError(
            async () => await this.formularioConfigService.obtenerConfiguracionPorConvocatoria(parent.id),
            'formularioConfig'
          );
        },
      },
    };
  }
}
