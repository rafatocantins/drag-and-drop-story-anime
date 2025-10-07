import { vi } from 'vitest';

vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: () => ({
        sendMail: vi.fn(async () => ({ messageId: 'mocked' }))
      })
    }
  };
});

vi.mock('ioredis', () => {
  class MockRedis {
    quit = vi.fn(async () => undefined);
  }
  return { default: MockRedis, __esModule: true };
});
