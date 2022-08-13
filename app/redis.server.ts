import Redis from 'ioredis'

let client: Redis | undefined;
export function getRedis() {
  if (client) {
    return client
  }
  const cs = process.env.REDIS ? process.env.REDIS : 'redis://127.0.0.1:6379'
  client = new Redis(cs)

  return client
}
