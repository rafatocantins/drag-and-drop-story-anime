import type { Queue, QueueScheduler, Worker } from 'bullmq';
import IORedis from 'ioredis';

let connection: IORedis | null = null;
let approvalQueueInstance: Queue | null = null;
let analyticsQueueInstance: Queue | null = null;
let approvalScheduler: QueueScheduler | null = null;
let analyticsScheduler: QueueScheduler | null = null;

export async function ensureQueues() {
  if (process.env.ENABLE_QUEUES !== 'true') {
    return { approvalQueue: null, analyticsQueue: null };
  }
  if (!connection) {
    const { Queue, QueueScheduler } = await import('bullmq');
    connection = new IORedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');
    approvalQueueInstance = new Queue('approval', { connection });
    analyticsQueueInstance = new Queue('analytics', { connection });
    approvalScheduler = new QueueScheduler('approval', { connection });
    analyticsScheduler = new QueueScheduler('analytics', { connection });
  }
  return { approvalQueue: approvalQueueInstance, analyticsQueue: analyticsQueueInstance };
}

export async function registerWorkers() {
  if (process.env.ENABLE_QUEUES !== 'true') return;
  await ensureQueues();
  const { Worker } = await import('bullmq');
  new Worker(
    'approval',
    async (job) => ({ acknowledged: true, jobId: job.id }),
    { connection: connection ?? undefined }
  );
  new Worker(
    'analytics',
    async (job) => ({ received: job.data }),
    { connection: connection ?? undefined }
  );
}

export async function closeQueues() {
  await approvalScheduler?.close();
  await analyticsScheduler?.close();
  await approvalQueueInstance?.close();
  await analyticsQueueInstance?.close();
  await connection?.quit();
  connection = null;
  approvalQueueInstance = null;
  analyticsQueueInstance = null;
  approvalScheduler = null;
  analyticsScheduler = null;
}
