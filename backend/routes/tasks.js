const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// ✅ Updated schema with dueDate
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  dueDate: Date, // 🆕 Added dueDate field
  userId: String,
});

const Task = mongoose.model("Task", taskSchema);

// ✅ Middleware to check JWT
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

// ✅ Create Task (with optional dueDate)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    const task = await Task.create({
      title,
      dueDate: dueDate ? new Date(dueDate) : null, // parse if provided
      completed: false,
      userId: req.userId,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
});

// ✅ Get All Tasks for User
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// ✅ Toggle Complete or Edit Title or DueDate
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedFields = {};
    if (req.body.completed !== undefined) updatedFields.completed = req.body.completed;
    if (req.body.title !== undefined) updatedFields.title = req.body.title;
    if (req.body.dueDate !== undefined) updatedFields.dueDate = new Date(req.body.dueDate);

    const task = await Task.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});

// ✅ Delete Task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});

module.exports = router;
