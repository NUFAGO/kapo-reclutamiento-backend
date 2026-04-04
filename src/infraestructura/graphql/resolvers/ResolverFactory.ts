// ============================================================================
// FACTORY PATTERN OPTIMIZADO - Configuración Declarativa de Resolvers
// ============================================================================

import { scalarResolvers } from './scalars';

// Importar resolvers de autenticación
import { AuthResolver } from './AuthResolver';
import { UsuarioResolver } from './UsuarioResolver';
import { ConvocatoriaResolver } from './ConvocatoriaResolver';
import { FormularioConfigResolver } from './FormularioConfigResolver';
import { AplicacionCandidatoResolver } from './AplicacionCandidatoResolver';
import { CandidatoResolver } from './CandidatoResolver';
import { EntrevistaLlamadaResolver } from './EntrevistaLlamadaResolver';
import { EntrevistaRegularResolver } from './EntrevistaRegularResolver';
import { DebidaDiligenciaResolver } from './DebidaDiligenciaResolver';
import { HistorialCandidatoResolver } from './HistorialCandidatoResolver';
import { ComentarioAplicacionResolver } from './ComentarioAplicacionResolver';
import { ReferenciaResolver } from './ReferenciaResolver';
import { PersonalResolver } from './PersonalResolver';
import { UploadResolver } from './UploadResolver';
import { ComunicacionEntradaResolver } from './ComunicacionEntradaResolver';

// Importar servicios
import { AuthService } from '../../../aplicacion/servicios/AuthService';
import { UsuarioService } from '../../../aplicacion/servicios/UsuarioService';
import { ConvocatoriaService } from '../../../aplicacion/servicios/ConvocatoriaService';
import { FormularioConfigService } from '../../../aplicacion/servicios/FormularioConfigService';
import { AplicacionService } from '../../../aplicacion/servicios/AplicacionService';
import { CandidatoService } from '../../../aplicacion/servicios/CandidatoService';
import { EntrevistaLlamadaService } from '../../../aplicacion/servicios/EntrevistaLlamadaService';
import { EntrevistaRegularService } from '../../../aplicacion/servicios/EntrevistaRegularService';
import { DebidaDiligenciaService } from '../../../aplicacion/servicios/DebidaDiligenciaService';
import { HistorialCandidatoService } from '../../../aplicacion/servicios/HistorialCandidatoService';
import { ComentarioAplicacionService } from '../../../aplicacion/servicios/ComentarioAplicacionService';
import { ReferenciaService } from '../../../aplicacion/servicios/ReferenciaService';
import { PersonalService } from '../../../aplicacion/servicios/PersonalService';
import { ComunicacionEntradaService } from '../../../aplicacion/servicios/ComunicacionEntradaService';

// Importar repositorios HTTP
import { HttpAuthRepository } from '../../persistencia/http/HttpAuthRepository';
import { HttpPersonalRepository } from '../../persistencia/http/HttpPersonalRepository';

// Importar repositorios MongoDB
import { UsuarioMongoRepository } from '../../persistencia/mongo/UsuarioMongoRepository';
import { ConvocatoriaMongoRepository } from '../../persistencia/mongo/ConvocatoriaMongoRepository';
import { FormularioConfigMongoRepository } from '../../persistencia/mongo/FormularioConfigMongoRepository';
import { CandidatoMongoRepository } from '../../persistencia/mongo/CandidatoMongoRepository';
import { AplicacionCandidatoMongoRepository } from '../../persistencia/mongo/AplicacionCandidatoMongoRepository';
import { EntrevistaLlamadaMongoRepository } from '../../persistencia/mongo/EntrevistaLlamadaMongoRepository';
import { EntrevistaRegularMongoRepository } from '../../persistencia/mongo/EntrevistaRegularMongoRepository';
import { DebidaDiligenciaMongoRepository } from '../../persistencia/mongo/DebidaDiligenciaMongoRepository';
import { HistorialCandidatoMongoRepository } from '../../persistencia/mongo/HistorialCandidatoMongoRepository';
import { ComentarioAplicacionMongoRepository } from '../../persistencia/mongo/ComentarioAplicacionMongoRepository';
import { ReferenciaMongoRepository } from '../../persistencia/mongo/ReferenciaMongoRepository';
import { ComunicacionEntradaMongoRepository } from '../../persistencia/mongo/ComunicacionEntradaMongoRepository';

// Importar Container para DI
import { Container } from '../../di/Container';

// Importar Logger
import { logger } from '../../logging';

/**
 * Factory para crear resolvers de autenticación
 * Mantiene solo lo esencial: Auth y Usuario
 */
export class ResolverFactory {
  /**
   * Container para inyección de dependencias
   */
  private static container: Container | null = null;

  /**
   * Obtener instancia del Container e inicializar dependencias
   */
  private static getContainer(): Container {
    if (!this.container) {
      this.container = Container.getInstance();
      this.initializeContainer();
    }
    return this.container;
  }

  /**
   * Inicializar todas las dependencias en el Container
   */
  private static initializeContainer(): void {
    const container = this.getContainer();

    // Registrar HttpAuthRepository
    container.register('HttpAuthRepository', () => new HttpAuthRepository(), true);

    // Registrar HttpPersonalRepository
    container.register('HttpPersonalRepository', () => new HttpPersonalRepository(), true);

    // Registrar UsuarioMongoRepository
    container.register('UsuarioMongoRepository', () => new UsuarioMongoRepository(), true);

    // Registrar ConvocatoriaMongoRepository
    container.register('ConvocatoriaMongoRepository', () => new ConvocatoriaMongoRepository(), true);

    // Registrar FormularioConfigMongoRepository
    container.register('FormularioConfigMongoRepository', () => new FormularioConfigMongoRepository(), true);

    // Registrar CandidatoMongoRepository
    container.register('CandidatoMongoRepository', () => new CandidatoMongoRepository(), true);

    // Registrar AplicacionCandidatoMongoRepository
    container.register('AplicacionCandidatoMongoRepository', () => new AplicacionCandidatoMongoRepository(), true);

    // Registrar EntrevistaLlamadaMongoRepository
    container.register('EntrevistaLlamadaMongoRepository', () => new EntrevistaLlamadaMongoRepository(), true);

    // Registrar EntrevistaRegularMongoRepository
    container.register('EntrevistaRegularMongoRepository', () => new EntrevistaRegularMongoRepository(), true);

    // Registrar DebidaDiligenciaMongoRepository
    container.register('DebidaDiligenciaMongoRepository', () => new DebidaDiligenciaMongoRepository(), true);

    // Registrar HistorialCandidatoMongoRepository
    container.register('HistorialCandidatoMongoRepository', () => new HistorialCandidatoMongoRepository(), true);

    // Registrar ComentarioAplicacionMongoRepository
    container.register('ComentarioAplicacionMongoRepository', () => new ComentarioAplicacionMongoRepository(), true);

    // Registrar ReferenciaMongoRepository
    container.register('ReferenciaMongoRepository', () => new ReferenciaMongoRepository(), true);

    // Registrar ComunicacionEntradaMongoRepository
    container.register('ComunicacionEntradaMongoRepository', () => new ComunicacionEntradaMongoRepository(), true);

    // Registrar AuthService
    container.register('AuthService', (c) => {
      const httpAuthRepo = c.resolve<HttpAuthRepository>('HttpAuthRepository');
      return new AuthService(httpAuthRepo);
    }, true);

    // Registrar UsuarioService
    container.register('UsuarioService', (c) => {
      const usuarioRepo = c.resolve<HttpAuthRepository>('HttpAuthRepository');
      return new UsuarioService(usuarioRepo);
    }, true);

    // Registrar AuthResolver
    container.register('AuthResolver', (c) => {
      const authService = c.resolve<AuthService>('AuthService');
      return new AuthResolver(authService);
    }, true);

    // Registrar UsuarioResolver
    container.register('UsuarioResolver', (c) => {
      const usuarioService = c.resolve<UsuarioService>('UsuarioService');
      return new UsuarioResolver(usuarioService);
    }, true);

    // Registrar ConvocatoriaService
    container.register('ConvocatoriaService', (c) => {
      const convocatoriaRepo = c.resolve<ConvocatoriaMongoRepository>('ConvocatoriaMongoRepository');
      return new ConvocatoriaService(convocatoriaRepo);
    }, true);

    // Registrar FormularioConfigService
    container.register('FormularioConfigService', (c) => {
      const formularioConfigRepo = c.resolve<FormularioConfigMongoRepository>('FormularioConfigMongoRepository');
      return new FormularioConfigService(formularioConfigRepo);
    }, true);

    // Registrar ConvocatoriaResolver
    container.register('ConvocatoriaResolver', (c) => {
      const convocatoriaService = c.resolve<ConvocatoriaService>('ConvocatoriaService');
      const formularioConfigService = c.resolve<FormularioConfigService>('FormularioConfigService');
      return new ConvocatoriaResolver(convocatoriaService, formularioConfigService);
    }, true);

    // Registrar FormularioConfigResolver
    container.register('FormularioConfigResolver', (c) => {
      const formularioConfigService = c.resolve<FormularioConfigService>('FormularioConfigService');
      return new FormularioConfigResolver(formularioConfigService);
    }, true);

    // Registrar CandidatoService
    container.register('CandidatoService', (c) => {
      const candidatoRepo = c.resolve<CandidatoMongoRepository>('CandidatoMongoRepository');
      return new CandidatoService(candidatoRepo);
    }, true);

    // Registrar AplicacionService
    container.register('AplicacionService', (c) => {
      const candidatoRepo = c.resolve<CandidatoMongoRepository>('CandidatoMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      const convocatoriaRepo = c.resolve<ConvocatoriaMongoRepository>('ConvocatoriaMongoRepository');
      const personalService = c.resolve<PersonalService>('PersonalService');
      const historialService = c.resolve<HistorialCandidatoService>('HistorialCandidatoService');
      return new AplicacionService(candidatoRepo, aplicacionRepo, convocatoriaRepo, personalService, historialService);
    }, true);

    // Registrar EntrevistaLlamadaService
    container.register('EntrevistaLlamadaService', (c) => {
      const entrevistaRepo = c.resolve<EntrevistaLlamadaMongoRepository>('EntrevistaLlamadaMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      return new EntrevistaLlamadaService(entrevistaRepo, aplicacionRepo);
    }, true);

    // Registrar EntrevistaRegularService
    container.register('EntrevistaRegularService', (c) => {
      const entrevistaRepo = c.resolve<EntrevistaRegularMongoRepository>('EntrevistaRegularMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      return new EntrevistaRegularService(entrevistaRepo, aplicacionRepo);
    }, true);

    // Registrar DebidaDiligenciaService
    container.register('DebidaDiligenciaService', (c) => {
      const debidaDiligenciaRepo = c.resolve<DebidaDiligenciaMongoRepository>('DebidaDiligenciaMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      return new DebidaDiligenciaService(debidaDiligenciaRepo, aplicacionRepo);
    }, true);

    // Registrar HistorialCandidatoService
    container.register('HistorialCandidatoService', (c) => {
      const historialRepo = c.resolve<HistorialCandidatoMongoRepository>('HistorialCandidatoMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      return new HistorialCandidatoService(historialRepo, aplicacionRepo);
    }, true);

    // Registrar ComentarioAplicacionService
    container.register('ComentarioAplicacionService', (c) => {
      const comentarioRepo = c.resolve<ComentarioAplicacionMongoRepository>('ComentarioAplicacionMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      return new ComentarioAplicacionService(comentarioRepo, aplicacionRepo);
    }, true);

    // Registrar ReferenciaService
    container.register('ReferenciaService', (c) => {
      const referenciaRepo = c.resolve<ReferenciaMongoRepository>('ReferenciaMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      return new ReferenciaService(referenciaRepo, aplicacionRepo);
    }, true);

    // Registrar ComunicacionEntradaService
    container.register('ComunicacionEntradaService', (c) => {
      const comunicacionRepo = c.resolve<ComunicacionEntradaMongoRepository>('ComunicacionEntradaMongoRepository');
      const aplicacionRepo = c.resolve<AplicacionCandidatoMongoRepository>('AplicacionCandidatoMongoRepository');
      const candidatoRepo = c.resolve<CandidatoMongoRepository>('CandidatoMongoRepository');
      return new ComunicacionEntradaService(comunicacionRepo, aplicacionRepo, candidatoRepo);
    }, true);

    // Registrar AplicacionCandidatoResolver
    container.register('AplicacionCandidatoResolver', (c) => {
      const aplicacionService = c.resolve<AplicacionService>('AplicacionService');
      const candidatoService = c.resolve<CandidatoService>('CandidatoService');
      const convocatoriaService = c.resolve<ConvocatoriaService>('ConvocatoriaService');
      return new AplicacionCandidatoResolver(aplicacionService, candidatoService, convocatoriaService);
    }, true);

    // Registrar CandidatoResolver
    container.register('CandidatoResolver', (c) => {
      const candidatoService = c.resolve<CandidatoService>('CandidatoService');
      const aplicacionService = c.resolve<AplicacionService>('AplicacionService');
      return new CandidatoResolver(candidatoService, aplicacionService);
    }, true);

    // Registrar EntrevistaLlamadaResolver
    container.register('EntrevistaLlamadaResolver', (c) => {
      const entrevistaService = c.resolve<EntrevistaLlamadaService>('EntrevistaLlamadaService');
      return new EntrevistaLlamadaResolver(entrevistaService);
    }, true);

    // Registrar EntrevistaRegularResolver
    container.register('EntrevistaRegularResolver', (c) => {
      const entrevistaService = c.resolve<EntrevistaRegularService>('EntrevistaRegularService');
      return new EntrevistaRegularResolver(entrevistaService);
    }, true);

    // Registrar DebidaDiligenciaResolver
    container.register('DebidaDiligenciaResolver', (c) => {
      const debidaDiligenciaService = c.resolve<DebidaDiligenciaService>('DebidaDiligenciaService');
      return new DebidaDiligenciaResolver(debidaDiligenciaService);
    }, true);

    // Registrar HistorialCandidatoResolver
    container.register('HistorialCandidatoResolver', (c) => {
      const historialService = c.resolve<HistorialCandidatoService>('HistorialCandidatoService');
      return new HistorialCandidatoResolver(historialService);
    }, true);

    // Registrar ComentarioAplicacionResolver
    container.register('ComentarioAplicacionResolver', (c) => {
      const svc = c.resolve<ComentarioAplicacionService>('ComentarioAplicacionService');
      return new ComentarioAplicacionResolver(svc);
    }, true);

    // Registrar ReferenciaResolver
    container.register('ReferenciaResolver', (c) => {
      const referenciaService = c.resolve<ReferenciaService>('ReferenciaService');
      return new ReferenciaResolver(referenciaService);
    }, true);

    // Registrar ComunicacionEntradaResolver
    container.register('ComunicacionEntradaResolver', (c) => {
      const comunicacionService = c.resolve<ComunicacionEntradaService>('ComunicacionEntradaService');
      return new ComunicacionEntradaResolver(comunicacionService);
    }, true);

    // Registrar PersonalService (consumo desde MS Personal)
    container.register('PersonalService', (c) => {
      const personalRepo = c.resolve<HttpPersonalRepository>('HttpPersonalRepository');
      return new PersonalService(personalRepo);
    }, true);

    // Registrar PersonalResolver
    container.register('PersonalResolver', (c) => {
      const personalService = c.resolve<PersonalService>('PersonalService');
      return new PersonalResolver(personalService);
    }, true);

    // Registrar UploadResolver
    container.register('UploadResolver', () => new UploadResolver(), true);

    logger.info('Container inicializado con dependencias de autenticación, usuarios, convocatorias, formularios, entrevistas (llamada y regular), historial, referencias, personal y upload');
  }

  /**
   * Crea todos los resolvers usando Container para inyección de dependencias
   * @returns Array de resolvers GraphQL
   */
  static createResolvers(): unknown[] {
    const resolvers: unknown[] = [scalarResolvers];
    const container = this.getContainer();

    try {
      // Crear AuthResolver
      const authResolver = container.resolve<AuthResolver>('AuthResolver');
      resolvers.push(authResolver.getResolvers());
      logger.debug('Resolver configurado: auth');

      // Crear UsuarioResolver
      const usuarioResolver = container.resolve<UsuarioResolver>('UsuarioResolver');
      resolvers.push(usuarioResolver.getResolvers());
      logger.debug('Resolver configurado: usuario');

      // Crear ConvocatoriaResolver
      const convocatoriaResolver = container.resolve<ConvocatoriaResolver>('ConvocatoriaResolver');
      resolvers.push(convocatoriaResolver.getResolvers());
      logger.debug('Resolver configurado: convocatoria');

      // Crear FormularioConfigResolver
      const formularioConfigResolver = container.resolve<FormularioConfigResolver>('FormularioConfigResolver');
      resolvers.push(formularioConfigResolver.getResolvers());
      logger.debug('Resolver configurado: formulario-config');

      // Crear AplicacionCandidatoResolver
      const aplicacionCandidatoResolver = container.resolve<AplicacionCandidatoResolver>('AplicacionCandidatoResolver');
      resolvers.push(aplicacionCandidatoResolver.getResolvers());
      logger.debug('Resolver configurado: aplicacion-candidato');

      // Crear CandidatoResolver
      const candidatoResolver = container.resolve<CandidatoResolver>('CandidatoResolver');
      resolvers.push(candidatoResolver.getResolvers());
      logger.debug('Resolver configurado: candidato');

      // Crear EntrevistaLlamadaResolver
      const entrevistaLlamadaResolver = container.resolve<EntrevistaLlamadaResolver>('EntrevistaLlamadaResolver');
      resolvers.push(entrevistaLlamadaResolver.getResolvers());
      logger.debug('Resolver configurado: entrevista-llamada');

      // Crear EntrevistaRegularResolver
      const entrevistaRegularResolver = container.resolve<EntrevistaRegularResolver>('EntrevistaRegularResolver');
      resolvers.push(entrevistaRegularResolver.getResolvers());
      logger.debug('Resolver configurado: entrevista-regular');

      // Crear DebidaDiligenciaResolver
      const debidaDiligenciaResolver = container.resolve<DebidaDiligenciaResolver>('DebidaDiligenciaResolver');
      resolvers.push(debidaDiligenciaResolver.getResolvers());
      logger.debug('Resolver configurado: debida-diligencia');

      // Crear HistorialCandidatoResolver
      const historialCandidatoResolver = container.resolve<HistorialCandidatoResolver>('HistorialCandidatoResolver');
      resolvers.push(historialCandidatoResolver.getResolvers());
      logger.debug('Resolver configurado: historial-candidato');

      // Crear ComentarioAplicacionResolver
      const comentarioAplicacionResolver = container.resolve<ComentarioAplicacionResolver>('ComentarioAplicacionResolver');
      resolvers.push(comentarioAplicacionResolver.getResolvers());
      logger.debug('Resolver configurado: comentario-aplicacion');

      // Crear ReferenciaResolver
      const referenciaResolver = container.resolve<ReferenciaResolver>('ReferenciaResolver');
      resolvers.push(referenciaResolver.getResolvers());
      logger.debug('Resolver configurado: referencia');

      // Crear ComunicacionEntradaResolver
      const comunicacionEntradaResolver = container.resolve<ComunicacionEntradaResolver>('ComunicacionEntradaResolver');
      resolvers.push(comunicacionEntradaResolver.getResolvers());
      logger.debug('Resolver configurado: comunicacion-entrada');

      // Crear PersonalResolver
      const personalResolver = container.resolve<PersonalResolver>('PersonalResolver');
      resolvers.push(personalResolver.getResolvers());
      logger.debug('Resolver configurado: personal');

      // Crear UploadResolver
      const uploadResolver = container.resolve<UploadResolver>('UploadResolver');
      resolvers.push(uploadResolver.getResolvers());
      logger.debug('Resolver configurado: upload');
    } catch (error) {
      logger.error('Error configurando resolvers', {
        error: error instanceof Error ? error.message : String(error)
      });
    }

    logger.info(`Total de resolvers configurados: ${resolvers.length}`);
    return resolvers;
  }
}
