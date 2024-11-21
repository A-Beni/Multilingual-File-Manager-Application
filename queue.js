const Queue = require('bull');
const fileQueue = new Queue('file-queue', { redis: { host: '127.0.0.1', port: 6379 } });

fileQueue.process((job, done) => {
    // Example task: Simulate file upload
    console.log(`Processing job: ${job.id}`);
    setTimeout(() => done(), 3000); // Simulate task completion
});

module.exports = fileQueue;
