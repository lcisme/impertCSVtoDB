// mongodbConnection.js
const mongodb = require("mongodb");

// URL kết nối MongoDB
const urlDB = "mongodb://localhost:27017/filecsv?authSource=admin";

// Kết nối với MongoDB
async function connectToMongoDB() {
  return mongodb.MongoClient.connect(urlDB);
}

module.exports = connectToMongoDB;
