import { v4 } from 'uuid';
import { redis } from '../redis';

export const confirmEmailLink = async (userId: string): Promise<string> => {
  const key = v4();
  const value = userId;

  // Store a key/value pair in redis with a random UUID as the key, the userId as the value, and a 15 min expiration
  await redis.set(key, userId, 'ex', 60 * 60 * 15);

  return `${process.env.BACKEND_HOST}/auth/verifyuser/${key}`;
};
