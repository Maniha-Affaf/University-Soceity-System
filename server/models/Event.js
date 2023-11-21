const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    by: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stime: {
        type: String,
        required: true
    },
    etime: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
})

const event = mongoose.model("EventDB", eventSchema)
module.exports = event