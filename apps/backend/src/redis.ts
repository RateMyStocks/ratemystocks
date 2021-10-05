import * as Redis from 'ioredis';

require('dotenv').config();

// You must specify NODE_ENV due to a weird NestJS/Nx issue: https://stackoverflow.com/questions/58090082/process-env-node-env-always-development-when-building-nestjs-app-with-nrwl-nx
export const redis = process.env['NODE' + '_ENV'] === 'local' ? new Redis() : new Redis(process.env.REDIS_URL);
