const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser module
const app = express();
const port = 5000;
const mongoDB = require('./database.js');
const cors = require("cors");

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoDB();

// CORS middleware
app.use(cors({
   origin: '*', 
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
}));

// Import your routers
const createUserRouter = require("./routes/CreateUser.js");
const putTasksRouter = require("./routes/PutTasks.js");
const getTasksRouter = require("./routes/GetTask.js");
const editTasksRouter = require("./routes/EditTask.js");


// Use your routers
app.use('/api', createUserRouter);
app.use('/api', putTasksRouter);
app.use('/api', getTasksRouter);
app.use('/api', editTasksRouter);


// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
