const csvtojson = require("csvtojson");
const mongodb = require("mongodb");

let urlDB = "mongodb://root:root@localhost:27017/filecsv?authSource=admin";

function formatCurrency(value) {
  let number = parseFloat(value);
  if (isNaN(number)) return value;
  return number
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace("₫", "");
}

async function importCSVtoDB() {
  console.time();
  try {
    const client = await mongodb.MongoClient.connect(urlDB);
    const dbConn = client.db();

    const fileName = "chuyen_khoan.csv";
    let arrayToInsert = [];

    const source = await csvtojson().fromFile(fileName);

    for (let i = 0; i < source.length; i++) {
      let dateTimeParts = source[i]["date_time"].split("_");

      let oneRow = {
        day: dateTimeParts[0],
        transactionId: dateTimeParts[1],
        trans_no: source[i]["trans_no"],
        credit: source[i]["credit"],
        debit: source[i]["debit"],
        detail: source[i]["detail"],
        VND: formatCurrency(source[i]["credit"]),
      };
      arrayToInsert.push(oneRow);
    }

    let collection = dbConn.collection("saokev2");
    const result = await collection.insertMany(arrayToInsert);

    if (result) {
      console.log("Import CSV into database successfully.");
    }

    await client.close();
    console.timeEnd();
  } catch (err) {
    console.log(err.message);
  }
}

async function createIndexCollection() {
  console.time("createIndexCollection");
  const client = await mongodb.MongoClient.connect(urlDB);
  const dbConn = client.db();
  let collection = dbConn.collection("saoke");
  // await collection.dropIndex({ date_time: 1, credit: 1 });
  // await collection.createIndex({ date_time: 1, credit: 1 });
  //   await collection.createIndex({ detail: 1 }, { unique: true });
  await collection.createIndex({ detail: "text" });

  //   await collection.dropIndex({ detail: 1 }, { unique: true });

  await client.close();
  console.timeEnd("createIndexCollection");
}
// danh index

async function filterUser(params) {
  console.time("filterUser");
  const client = await mongodb.MongoClient.connect(urlDB);
  const dbConn = client.db();
  let collection = dbConn.collection("saoke");

  let query = {};
  if (params.date_time) {
    query.date_time = params.date_time;
  }

  if (params.credit) {
    query.credit = params.credit;
  }

  if (params.detail) {
    query.detail = { $regex: params.detail, $options: "i" };
    // query.detail = { $text: { $search: params.detail }, $options: "i" };
  }
  const results = await collection.find(query).toArray();
  console.log("Filtered Results:", results);
  console.log(params);
  console.log(results.length);

  await client.close();
  console.timeEnd("filterUser");
}
//import to db
importCSVtoDB();

//index
// createIndexCollection();

//search
// filterUser({ detail: "tien" });
