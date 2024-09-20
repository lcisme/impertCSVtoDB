const { searchInElasticsearch } = require("./elasticsearchSearch");

async function searchTransaction(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "Keyword is required" });
  }

  try {
    const results = await searchInElasticsearch(keyword);
    if (results && results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No results found" });
    }
  } catch (error) {
    console.error("Error searching in Elasticsearch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { searchTransaction };
