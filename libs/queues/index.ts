import { queue as cafeQueue } from './cafe';
import { queue as cronQueue } from './cron';

export const queues = {
  cafe: cafeQueue,
  cron: cronQueue,
};

// Helper to check if queues are available
export const areQueuesAvailable = (): boolean => {
  return cafeQueue !== null && cronQueue !== null;
};