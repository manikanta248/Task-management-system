const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Task } = require('../models/PutTaskModel.js'); // Import Task model

// Define your MongoDB connection URI
const mongoURI =
  'mongodb+srv://sangamkarmanikanta:manigsn123@cluster0.fc1kshh.mongodb.net/taskmanager1212?retryWrites=true&w=majority&appName=Cluster0';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');

    // Define your route to edit a task
    router.post('/edittask/:id', async (req, res) => {
      try {
        const taskId = req.params.id;
        const { task, endDate, priority, status } = req.body; // Destructure relevant fields from request body

        // Find the task by ID and update its properties
        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { task, endDate, priority, status }, // Update task properties
          { new: true }
        );

        // If task is not found, return 404
        if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found' });
        }

        // Send the updated task as JSON response
        res.json({success:updatedTask});
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    });
  })
  .catch((err) => console.log(err));

module.exports = router;
