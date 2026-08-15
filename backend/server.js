const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const messageRoutes = require("./routes/messageRoutes");
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((error) => {
        console.error(
            "❌ MongoDB Connection Failed:",
            error.message
        );
    });

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🇮🇳 15 August Backend is Running!"
    });
});

app.use(
    "/api/auth",
    authRoutes
);

app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});