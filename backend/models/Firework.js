const mongoose = require("mongoose");

const fireworkSchema = new mongoose.Schema(
    {
        count: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Firework", fireworkSchema);