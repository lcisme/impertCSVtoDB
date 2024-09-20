const { Client } = require("@elastic/elasticsearch");
const redis = require("redis");

// Cấu hình kết nối với Elasticsearch
const esClient = new Client({
  node: "http://localhost:9200/",
  auth: {
    username: "elastic",
    password: "pQVq1CjKfASZuHxdOM5M",
  },
});

// Cấu hình kết nối với Redis
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
  db: 5,
});

// Kiểm tra kết nối Redis
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Hàm để lấy dữ liệu từ Elasticsearch và lưu vào Redis
async function fetchDataFromES() {
  try {
    const { body } = await esClient.search({
      index: "blog_posts",
      body: {
        query: {
          match_all: {},
        },
      },
    });

    const hits = body.hits.hits;

    // Lưu dữ liệu vào Redis
    hits.forEach((hit) => {
      redisClient.set(hit._id, JSON.stringify(hit._source), (err) => {
        if (err) {
          console.error("Error saving to Redis:", err);
        } else {
          console.log(`Saved document ${hit._id} to Redis`);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching data from Elasticsearch:", error);
  }
}

// Kết nối Redis và lấy dữ liệu
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
    fetchDataFromES();
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

async function addDataToElasticsearch(id, data) {
  try {
    // Thêm dữ liệu vào Elasticsearch
    await esClient.index({
      index: "blog_posts",
      id,
      body: data,
    });

    // Thêm dữ liệu vào Redis
    redisClient.hset(`blog_posts:${id}`, data, (err, res) => {
      if (err) console.error("Redis error:", err);
      else console.log("Redis response:", res);
    });
  } catch (err) {
    console.error("Error adding data:", err);
  }
}

const newPost = {
  title: "My First Post",
  content: "This is the content of the post",
  date: new Date(),
};

addDataToElasticsearch("1", newPost)
  .then(() => searchElasticsearch("content"))
  .then((results) => console.log("Search results:", results))
  .catch((err) => console.error("Error:", err));
