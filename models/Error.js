const mongoose = require("mongoose");

const ErrorSchema = new mongoose.Schema({
    message: String,
});

module.exports = mongoose.model('Error', ErrorSchema);