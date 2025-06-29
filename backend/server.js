const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));

// ✅ CORS middleware — only once!

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://todo-task-manager-hackathon.vercel.app" // ✅ Your real frontend URL
  ],
  credentials: true,
}));


// ✅ Body parsers
app.use(express.json());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🌐 Backend working");
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
