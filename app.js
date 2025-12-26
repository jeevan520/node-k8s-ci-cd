const express = require("express");
const os = require("os");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Node.js Kubernetes CI/CD 🚀",
    pod: os.hostname(),
    time: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
