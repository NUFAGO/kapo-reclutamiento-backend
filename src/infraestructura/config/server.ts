import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import cors from 'cors';
import http from 'http';
import { logger } from '../logging';
import { HealthCheckService } from '../health/HealthCheckService';
import { DatabaseHealthCheck } from '../health/DatabaseHealthCheck';

import { ConfigService } from './ConfigService';
import { buildPermissions } from '../graphql/auth/permissions';
import { decodificarClaims } from '../auth/tokenContext';
import { createGatewayValidationMiddleware } from '../auth/gatewayValidationMiddleware';

const configService = ConfigService.getInstance();

const config = {
  port: configService.getServerPort(),
  host: "0.0.0.0",
  timeout: 600000,
  maxFileSize: 50 * 1024 * 1024,
  maxFiles: 100,
  allowedOrigins: configService.getCorsOrigins()
};

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    // Permitir peticiones sin origen (ej: Postman, extensiones de navegador, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Permitir localhost y 127.0.0.1
    if (origin.startsWith("http://localhost:") || origin.startsWith("https://localhost:") ||
      origin.startsWith("http://127.0.0.1:") || origin.startsWith("https://127.0.0.1:")) {
      callback(null, true);
      return;
    }

    // Permitir Apollo Studio
    if (origin.startsWith("https://studio.apollographql.com")) {
      callback(null, true);
      return;
    }

    // Permitir orígenes configurados
    if (config.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Rechazar silenciosamente extensiones de Chrome y otros orígenes no permitidos
    // No lanzar error para evitar ruido en los logs
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "X-Recibir-Convocatoria-Secret",
    "X-Recibir-Convocatoria-Key",
  ],
};

export const createServer = (resolvers: any, typeDefs: any): { app: Application; httpServer: http.Server; apolloServer: ApolloServer } => {
  const app = express();
  app.use(cors(corsOptions));
  app.use(express.json({ limit: `${config.maxFileSize}mb` }));
  app.use(express.urlencoded({ extended: true, limit: `${config.maxFileSize}mb` }));

  // Configurar Health Check Service
  const healthCheckService = new HealthCheckService();

  // Registrar health checks
  healthCheckService.register('database', new DatabaseHealthCheck());

  // Endpoint de health check
  app.get('/health', async (_, res) => {
    try {
      const result = await healthCheckService.checkAll();
      const statusCode = result.overall === 'healthy' ? 200 : 503;
      res.status(statusCode).json({
        ...result,
        uptime: process.uptime(),
        config: {
          port: config.port,
          mode: configService.getDatabaseMode(),
          nodeEnv: configService.getNodeEnv()
        }
      });
    } catch (error) {
      logger.error('Error ejecutando health checks', { error: error instanceof Error ? error.message : String(error) });
      res.status(503).json({
        overall: 'unhealthy',
        error: 'Error ejecutando health checks',
        timestamp: new Date()
      });
    }
  });

  const httpServer = http.createServer({ maxHeaderSize: 128 * 1024 }, app);
  httpServer.timeout = config.timeout + 300000;
  httpServer.keepAliveTimeout = 120000;
  httpServer.headersTimeout = 125000;

  // Bloqueo de acceso directo: solo tráfico del gateway cuando
  // REQUIRE_GATEWAY_SECRET=true (dev: false). Montado antes de Apollo.
  app.use('/graphql', createGatewayValidationMiddleware(configService));

  const baseSchema = makeExecutableSchema({ typeDefs, resolvers });
  // applyMiddleware devuelve GraphQLSchemaWithFragmentReplacements (tipo de
  // graphql-middleware); es un GraphQLSchema válido en runtime. El cast evita el
  // choque de la marca privada `_queryType` entre las .d.ts de ambos paquetes.
  const schema = applyMiddleware(baseSchema, buildPermissions(configService));

  const apolloServer = new ApolloServer({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: schema as any,
    introspection: true,
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1];

      let usuarioAuth = null;
      let authMotivo: string | undefined;

      // Llamada M2M este-oeste: el gateway interno inyecta X-Internal-Gateway-Secret.
      const upstreamSecret = configService.getInternalUpstreamSecret();
      const recibido = req.headers['x-internal-gateway-secret'];
      const internalTrusted =
        !!upstreamSecret &&
        typeof recibido === 'string' &&
        recibido === upstreamSecret;

      // Este MS NO valida el token (firma/expiración/sesión = trabajo del
      // gateway). Solo DECODIFICA los claims para contexto de resolvers.
      // Cuando es interno (JWT de servicio, no de usuario) se omite el parseo.
      if (!internalTrusted && token) {
        usuarioAuth = decodificarClaims(token);
        if (!usuarioAuth) authMotivo = 'TOKEN_INVALIDO';
      }

      return { req, token, usuarioAuth, authMotivo, internalTrusted };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    persistedQueries: false,
    formatError: (error) => {
      logger.error("GraphQL Error", {
        error: error.message,
        extensions: error.extensions,
        path: error.path
      });
      return error.toJSON();
    },
  });

  return { app, httpServer, apolloServer };
};

export const startServer = async (app: Application, httpServer: http.Server, apolloServer: ApolloServer): Promise<void> => {
  await apolloServer.start();

  // Usar dynamic import para el middleware ES Module
  // @ts-expect-error - dynamic import de ES Module .js
  const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.js');
  app.use(graphqlUploadExpress({ maxFileSize: config.maxFileSize, maxFiles: config.maxFiles }));
  apolloServer.applyMiddleware({ app: app as any, path: "/graphql", cors: false });

  logger.info(`Servidor iniciando`, {
    host: config.host,
    port: config.port,
    mode: configService.getDatabaseMode()
  });

  httpServer.listen(config.port, config.host, () => {
    logger.info(`GraphQL disponible`, {
      url: `http://${config.host}:${config.port}${apolloServer.graphqlPath}`
    });
    if (process.env['NODE_ENV'] !== 'production') {
      logger.info(`GraphQL Playground disponible`, {
        url: `http://localhost:${config.port}${apolloServer.graphqlPath}`
      });
    }
  });
};

