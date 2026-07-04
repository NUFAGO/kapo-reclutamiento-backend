// ============================================================================
// RESOLVER GRAPHQL - PERSONAL (Consumo desde MS Personal)
// ============================================================================

import { IResolvers } from '@graphql-tools/utils';
import { PersonalService } from '../../../aplicacion/servicios/PersonalService';
import {
  PersonalFilterInput,
  PersonalReferenciasInput
} from '../../../dominio/entidades/Personal';
import { EmpleadoCHFiltro } from '../../../dominio/repositorios/IPersonalRepository';
import { ErrorHandler } from './ErrorHandler';

/**
 * Resolver de personal que consume datos desde el sistema PERSONAL/Personal
 */
export class PersonalResolver {
  constructor(private readonly personalService: PersonalService) {}

  /**
   * Implementa los resolvers específicos para personal
   */
  getResolvers(): IResolvers {
    return {
      Query: {
        listEmpleadoCH: async (_: unknown, args: { filter?: EmpleadoCHFiltro }) => {
          return await ErrorHandler.handleError(
            async () => await this.personalService.listEmpleadoCH(args.filter),
            'listEmpleadoCH',
            { filter: args.filter }
          );
        },

        empleadosPaginados: async (
          _: unknown,
          args: {
            page?: number;
            limit?: number;
            filter?: PersonalFilterInput;
            referencias?: PersonalReferenciasInput;
          }
        ) => {
          const { page = 1, limit = 10, filter, referencias } = args;
          return await ErrorHandler.handleError(
            async () => await this.personalService.empleadosPaginados(page, limit, filter, referencias),
            'empleadosPaginados',
            { page, limit, filter, referencias }
          );
        },

        obtenerEmpleadoPorId: async (_: unknown, args: { id: string }) => {
          const { id } = args;
          return await ErrorHandler.handleError(
            async () => await this.personalService.obtenerEmpleadoPorId(id),
            'obtenerEmpleadoPorId',
            { id }
          );
        },

        buscarEmpleados: async (
          _: unknown,
          args: { search?: string; page?: number; limit?: number }
        ) => {
          const { search, page = 1, limit = 10 } = args;
          return await ErrorHandler.handleError(
            async () => await this.personalService.buscarEmpleados(search, page, limit),
            'buscarEmpleados',
            { search, page, limit }
          );
        },

        obtenerEmpleadosDisponibles: async (
          _: unknown,
          args: { page?: number; limit?: number }
        ) => {
          const { page = 1, limit = 10 } = args;
          return await ErrorHandler.handleError(
            async () => await this.personalService.obtenerEmpleadosDisponibles(page, limit),
            'obtenerEmpleadosDisponibles',
            { page, limit }
          );
        }
      }
    };
  }
}