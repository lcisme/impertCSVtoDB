const client = require("./elasticsearchClient");

async function searchInElasticsearch(keyword) {
  try {
    const result = await client.search({
      index: "keyword",
      body: {
        query: {
          multi_match: {
            query: keyword,
            fields: ["transactionId", "day", "credit", "detail", "VND"],
          },
        },
      },
    });
    if (result.hits.hits.length > 0) {
      // console.log("Found results in Elasticsearch:", result.hits.hits);
      return result.hits.hits.map((hit) => hit._source);
    } else {
      console.log("No results found for keyword:", keyword);
      return [];
    }
  } catch (error) {
    console.error("Error searching in Elasticsearch:", error);
    throw error;
  }
}

module.exports = { searchInElasticsearch };
