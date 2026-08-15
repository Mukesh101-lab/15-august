const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", messageSchema);