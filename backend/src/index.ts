import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerNarrativeRoutes } from './routes/narratives';

export function buildServer() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: { colorize: true }
            }
          : undefined
    }
  });

  app.register(cors, { origin: true });
  app.register(registerNarrativeRoutes);

  return app;
}
