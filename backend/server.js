const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "https://your-frontend.vercel.app", credentials: true }));

app.use(express.json()); 
app.use("/api/tasks", require("./routes/tasks"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// to parse JSON body


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));

// Routes
app.use('/api/auth', require('./routes/auth'));

app.get("/", (req, res) => {
  res.send("🌐 Backend working");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use('/api/tasks', require('./routes/tasks'));
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://todo-task-manager-hackathon.vercel.app'],
    credentials: true,
  })
);
