const client = require("./elasticsearchClient");

async function indexDataToElasticsearch(chunkData) {
  const body = [];

  for (const row of chunkData) {
    body.push({ index: { _index: "keyword" } });
    body.push(row);
  }
  console.log(body);

  try {
    const { body: bulkResponse } = await client.bulk({ body });
    if (bulkResponse?.errors) {
      const erroredDocuments = bulkResponse.items.filter(
        (item) => item.index && item.index.error
      );
      console.error("Bulk indexing errors:", erroredDocuments);
    } else {
      console.log("Data indexed into Elasticsearch successfully.");
    }
  } catch (error) {
    console.error("Error indexing data to Elasticsearch:", error);
  }
}
module.exports = { indexDataToElasticsearch };
