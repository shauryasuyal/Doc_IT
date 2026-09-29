import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 5000;

await fastify.register(cors);

fastify.get('/api/health', async () => {
  return {
    status: 'ok',
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  };
});

async function start() {
  await connectDB();
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
