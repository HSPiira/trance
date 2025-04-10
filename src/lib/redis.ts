import { Redis } from 'ioredis';

// Configure Redis client with connection options
const redis = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379', {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
});

// Add event listeners for connection management
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

export { redis };