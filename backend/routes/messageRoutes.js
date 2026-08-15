const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// POST - Create Message
// ===============================

router.post("/", async (req, res) => {

    try {

        const { name, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({
                success: false,
                message: "Name and message are required"
            });
        }

        const newMessage = await Message.create({
            name,
            message
        });

        res.status(201).json({
            success: true,
            message: "Message saved successfully 🇮🇳",
            data: newMessage
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ===============================
// GET - All Messages
// ===============================

router.get("/", async (req, res) => {

    try {

        const messages = await Message
            .find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// ==========================================
// DELETE MESSAGE
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const deletedMessage =
                await Message.findByIdAndDelete(
                    req.params.id
                );

            if (!deletedMessage) {

                return res.status(404).json({
                    success: false,
                    message: "Message not found"
                });

            }

            res.json({
                success: true,
                message:
                    "Message deleted successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to delete message"
            });

        }

    }
);


module.exports = router;