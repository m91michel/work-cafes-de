import { config } from 'dotenv';
import { initializeQueues, shutdownQueues } from '../libs/queue';

// Load environment variables
config();

// Handle process termination signals
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await shutdownQueues();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await shutdownQueues();
  process.exit(0);
});

// Start the worker
async function startWorker() {
  try {
    console.log('Starting cafe processing worker...');
    const { workers } = await initializeQueues();
    
    console.log(`Worker started successfully. Listening for jobs...`);
    
    // Keep the process running
    setInterval(() => {
      // Report active jobs every minute
      workers.cafeProcessingWorker.getActiveCount().then(count => {
        console.log(`Active jobs: ${count}`);
      });
    }, 60000);
    
  } catch (error) {
    console.error('Error starting worker:', error);
    process.exit(1);
  }
}

startWorker();

