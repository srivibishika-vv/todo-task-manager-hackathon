const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  userId: String,
});

const Task = mongoose.model("Task", taskSchema);

// Middleware to check JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Create Task
router.post("/", verifyToken, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    completed: false,
    userId: req.userId,
  });
  res.json(task);
});

// ✅ Get All Tasks for User
router.get("/", verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// ✅ Toggle Complete
router.patch("/:id", verifyToken, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(task);
});

// ✅ Delete
router.delete("/:id", verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
const auth = require('../middleware/auth');

// Apply to all routes
router.use(auth);


module.exports = router;
