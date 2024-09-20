const express = require("express");
const { searchTransaction } = require("./apiController");

const app = express();
const port = 3000;

app.get("/search", searchTransaction);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
