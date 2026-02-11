const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
