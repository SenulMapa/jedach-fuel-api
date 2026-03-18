import { Hono } from 'hono';

const status = new Hono();

status.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default status;
