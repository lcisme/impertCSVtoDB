const cluster = require("cluster");
const os = require("os");
const { addChunkJobsToQueue } = require("./queueManager");
const { startWorker } = require("./worker");

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  const startTime = Date.now();

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });

  addChunkJobsToQueue("../1trieu.csv").then(() => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    console.log(`Total import time: ${totalTime}ms`);
  });
} else {
  console.log(`Worker process ${process.pid} started`);
  startWorker();
}
