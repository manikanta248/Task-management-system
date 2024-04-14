const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sangamkarmanikanta:manigsn123@cluster0.fc1kshh.mongodb.net/taskmanager1212?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
