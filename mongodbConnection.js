const mongodb = require("mongodb");

const urlDB = "mongodb://localhost:27017/filecsv?authSource=admin";

async function connectToMongoDB() {
  return mongodb.MongoClient.connect(urlDB);
}

module.exports = connectToMongoDB;
