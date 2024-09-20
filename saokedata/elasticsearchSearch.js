const client = require("./elasticsearchClient");

async function searchInElasticsearch(keyword) {
  try {
    const result = await client.search({
      index: "search",
      body: {
        query: {
          bool: {
            should: [
              {
                wildcard: {
                  transactionId: `*${keyword}*`,
                },
              },
              {
                wildcard: {
                  day: `*${keyword}*`,
                },
              },
              {
                wildcard: {
                  credit: `*${keyword}*`,
                },
              },
              {
                wildcard: {
                  detail: `*${keyword}*`,
                },
              },
              {
                wildcard: {
                  VND: `*${keyword}*`,
                },
              },
            ],
          },
        },
      },
    });

    if (result.hits.hits.length > 0) {
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
