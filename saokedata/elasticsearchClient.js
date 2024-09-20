const { Client } = require("@elastic/elasticsearch");

// Cấu hình client để kết nối với Elasticsearch
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200/",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || "elastic",
    password: process.env.ELASTICSEARCH_PASSWORD || "pQVq1CjKfASZuHxdOM5M",
  },
});

module.exports = client;
