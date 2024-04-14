const express = require('express');
const router = express.Router();
const { Task } = require('../models/PutTaskModel');

router.delete("/deletetask/:id", async (req, res) => {
  try {
      const taskId = req.params.id;
    console.log(req.params.id)
      // Find the task by its ID and delete it
      const deletedTask = await Task.findByIdAndDelete(req.params.id);

      if (!deletedTask) {
          return res.status(404).json({ success: false, error: "Task not found" });
      }

      res.status(200).json({ success: true, message: "Task deleted successfully", deletedTask });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
  }
});
router.post("/puttask", async (req, res) => {
    try {
      // Extract task data from request body
      console.log("Request Body:", req.body);
      const { task, enddate, priority } = req.body;
      console.log(req.body)
      // Extract token from request headers
      const token = req.headers.authorization?.split(" ")[1]; // Using optional chaining to avoid errors if authorization header is not present
      console.log("Token:", token);
  
      // Validate token (you should implement your token validation logic here)
      if (!token) {
        console.log("Unauthorized: Token missing");
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
  
      // Create a new task instance
      const newTask = new Task({
        task:task,
        endDate: enddate,
        priority: priority,
        token: token
      });
  
      // Save the new task to the database
      await newTask.save();
      console.log("Task saved:", newTask);
  
      res.status(201).json({ success: true, message: "Task successfully saved", task: newTask });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
  



// Import Subtask model
const { Subtask } = require('../models/PutTaskModel');

router.post("/putsubtask/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Create a new subtask instance
    const newSubtask = new Subtask({
      title: req.body.task,
      endDate: req.body.enddate,
      parentId:taskId
    });

    // Save the new subtask to the database
    await newSubtask.save();

    // Find the parent task by ID
    const parentTask = await Task.findById(taskId);

    if (!parentTask) {
      return res.status(404).json({ success: false, error: "Parent task not found" });
    }

    // Push the new subtask's _id into the subtasks array of the parent task
    parentTask.subtasks.push(newSubtask._id);

    // Save the updated parent task back to the database
    await parentTask.save();

    res.status(201).json({ success: true, message: "Subtask successfully added to the task", subtask: newSubtask });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});




module.exports = router;
