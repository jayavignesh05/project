const express = require("express");

const cors = require("cors");
const path = require("path");
const db = require("./db");
const app = express();
const PORT = 7000;

app.use(cors());
app.use(express.json({limit:"10mb"}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    console.log("✅ Connected to MySQL Database.");
    app.use("/api", require("./api/query/index"));

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err);
  }
})();
