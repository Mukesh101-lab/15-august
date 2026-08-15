const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password required"
            });
        }

        const adminUsername =
            process.env.ADMIN_USERNAME;

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        if (username !== adminUsername) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const passwordMatch =
            password === adminPassword;

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                username,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

});

module.exports = router;