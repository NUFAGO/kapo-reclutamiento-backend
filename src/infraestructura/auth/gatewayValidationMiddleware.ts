// ============================================================================
// MIDDLEWARE - Validación de origen gateway (X-Gateway-Secret)
// ============================================================================
// Bloquea el acceso DIRECTO a /graphql cuando REQUIRE_GATEWAY_SECRET=true:
// solo el kapo-gateway (que inyecta X-Gateway-Secret en el proxy) puede llegar.
// En dev se deja en false para no romper el acceso directo; en producción se
// activa junto con red privada (defensa en capas).

import type { NextFunction, Request, Response } from 'express';

import type { ConfigService } from '../config/ConfigService';
import { logger } from '../logging';

export function createGatewayValidationMiddleware(config: ConfigService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!config.requireGatewaySecret()) {
      return next();
    }

    const secretEsperado = config.getInternalGatewaySecret();
    const secretRecibido = req.headers['x-gateway-secret'];

    if (
      secretEsperado &&
      typeof secretRecibido === 'string' &&
      secretRecibido === secretEsperado
    ) {
      return next();
    }

    logger.warn('petición directa rechazada (sin X-Gateway-Secret válido)', {
      ip: req.ip,
      path: req.path,
    });
    res.status(401).json({
      errors: [
        {
          message: 'No autorizado: acceso solo a través del gateway',
          extensions: { code: 'UNAUTHENTICATED' },
        },
      ],
    });
  };
}
