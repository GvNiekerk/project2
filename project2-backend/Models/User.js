const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        max: 255,
        min: 5
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);