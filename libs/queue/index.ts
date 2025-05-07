import { cafeProcessingQueue } from './queues';
import { cafeProcessingWorker } from './workers';

// Export all queue-related functionality
export * from './config';
export * from './queues';
export * from './workers';

// Function to initialize all queues and workers
export async function initializeQueues() {
  // Make sure the queues are properly connected
  await cafeProcessingQueue.waitUntilReady();
  
  // Make sure the workers are properly connected
  await cafeProcessingWorker.waitUntilReady();
  
  console.log('Queue system initialized successfully');
  
  return {
    queues: {
      cafeProcessingQueue,
    },
    workers: {
      cafeProcessingWorker,
    },
  };
}

// Function to gracefully shut down all queues and workers
export async function shutdownQueues() {
  console.log('Shutting down queue system...');
  
  // Close the workers first
  await cafeProcessingWorker.close();
  
  // Then close the queues
  await cafeProcessingQueue.close();
  
  console.log('Queue system shut down successfully');
}

