const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Subtask } = require('../models/PutTaskModel');

// Define your MongoDB connection URI
const mongoURI =
  'mongodb+srv://sangamkarmanikanta:manigsn123@cluster0.fc1kshh.mongodb.net/taskmanager1212?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');

    // Define your route to load tasks
    router.post('/gettask', async (req, res) => {
      try {
        const { token } = req.body; // Destructure token directly from req.body
        // Access the MongoDB collection directly
        const collection = mongoose.connection.db.collection('tasks');
        // Fetch tasks from MongoDB collection
        const tasks = await collection.find({}).toArray();

        res.json(tasks);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    });
    router.get("/gettask/:taskId", async (req, res) => {
      try {
        const taskId = req.params.taskId;
    
        // Find the task by ID
        const task = await Task.findById(taskId);
    
        if (!task) {
          return res.status(404).json({ success: false, error: "Task not found" });
        }
    
        res.status(200).json({ success: true, task });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    });

    // Define your route to load subtasks for a specific task
    router.get("/getsubtask", async (req, res) => {
      try {
    
        // Find the parent task by ID and populate its subtasks
        const subtask = await Subtask.find({});
    
        if (!subtask) {
          return res.status(404).json({ success: false, error: "Parent task not found" });
        }
    
        // Extract subtasks from the parent task
        
    
        res.status(200).json({ success: true, subtask });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    });
    })
  .catch((err) => {
    console.log(err);
    process.exit(1); // Exit with failure
  });

module.exports = router;
