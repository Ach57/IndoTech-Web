//js/user.js file
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    resetPasswordToken: String, // Token for password reset
    resetPasswordExpires: Date, // Expiry time for password reset token
    status: { type: String, enum: ['online', 'offline'], default: 'offline' } // New field
});



module.exports = mongoose.model('User', userSchema);