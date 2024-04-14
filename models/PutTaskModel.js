const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubtaskSchema = new Schema({
  title: { type: String, required: true },
  endDate: { type: String, required: true },
  parentId:{type:String,required:true}
});

const TaskSchema = new Schema({
  task: { type: String, required: true },
  endDate: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  status: { type: String, default: 'To Do' },
  token: { type: String, required: true },
  subtasks: [{ type: Schema.Types.ObjectId, ref: 'Subtask' }],
  createdDate: { type: Date, default: Date.now } // Set default value to current date
});


const Subtask = mongoose.model('Subtask', SubtaskSchema);
const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task, Subtask };
