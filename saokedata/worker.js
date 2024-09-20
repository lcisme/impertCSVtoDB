const { Worker } = require("bullmq");
const redisConnection = require("./redisConnection");
const connectToMongoDB = require("./mongodbConnection");
const formatCurrency = require("./currencyFormatter");
const { indexDataToElasticsearch } = require("./elasticsearchIndex");

// Xử lý một chunk công việc
async function processChunk(chunkData) {
  const startTime = Date.now();
  let totalExecutionTime = 0;

  try {
    const client = await connectToMongoDB();
    const dbConn = client.db();
    const arrayToInsert = chunkData.map((row) => {
      let dateTimeParts = row[Object.keys(row)[0]].split("_");
      // console.log(row[Object.keys(row)[0]].split("_"));
      return {
        // day: dateTimeParts[0],
        // transactionId: dateTimeParts[1],
        day: row["day"],
        transactionId: row["transactionId"],
        credit: row["credit"],
        detail: row["detail"],
        VND: row["VND"],
        // VND: formatCurrency(row["credit"]),
      };
    });
    // indexDataToElasticsearch(arrayToInsert);
    let collection = dbConn.collection("saoke10trieu");
    const result = await collection.insertMany(arrayToInsert);

    if (result) {
      // console.log("Chunk inserted into database successfully.");
    }

    await client.close();
  } catch (err) {
    console.error(`Error in worker ${process.pid}: ${err.message}`);
  } finally {
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    totalExecutionTime += executionTime;
  }
}

// Khởi tạo worker để xử lý hàng đợi
function startWorker() {
  const worker = new Worker(
    "csvImportQueue",
    async (job) => {
      const { chunkData } = job.data;
      await processChunk(chunkData);
      // console.log(`Processed chunk job: ${job.id} by worker ${process.pid}`);
    },
    { connection: redisConnection }
  );
}

module.exports = { startWorker };
