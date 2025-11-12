import { queue as cafeQueue } from './cafe';
import { queue as cronQueue } from './cron';

export const queues = {
  cafe: cafeQueue,
  cron: cronQueue,
};