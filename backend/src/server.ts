import 'dotenv/config';
import { buildServer } from './index';
import { registerWorkers } from './queues';

const port = Number(process.env.PORT ?? 3000);

async function start() {
  const app = buildServer();
  if (process.env.ENABLE_QUEUES === 'true') {
    await registerWorkers();
  }
  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
