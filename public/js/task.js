const mongoose = require('mongoose');

// Define a Schema for accepted tasks
const acceptedTaskSchema = new mongoose.Schema({
    doorType: String,
    doorCategory: String,
    part: String,
    type: String,
    length: String,
    quantity: Number,
    projectNumber: String,
    estimatedTime: String,
    stockData: String,
    status: String, // 'accepted', 'on-hold', 'rejected'
    duration: Number, // Add duration in milliseconds
});

// Create and export the model
const AcceptedTask = mongoose.model('AcceptedTask', acceptedTaskSchema);
module.exports = AcceptedTask;
