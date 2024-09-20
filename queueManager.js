const { Queue } = require("bullmq");
const redisConnection = require("./redisConnection");
const fs = require("fs");
const csv = require("csv-parser");

const importQueue = new Queue("csvImportQueue", {
  connection: redisConnection,
});

async function addChunkJobsToQueue(fileName) {
  const CHUNK_SIZE = 250;
  let chunkData = [];
  let chunkCount = 0;

  const readStream = fs.createReadStream(fileName).pipe(csv());

  for await (const row of readStream) {
    chunkData.push(row);

    if (chunkData.length === CHUNK_SIZE) {
      await importQueue.add("importChunk", { chunkData });
      chunkCount++;
      chunkData = [];
    }
  }

  if (chunkData.length > 0) {
    await importQueue.add("importChunk", { chunkData });
    chunkCount++;
  }

  console.log(`${chunkCount} chunks added to queue.`);
}

module.exports = { importQueue, addChunkJobsToQueue };
