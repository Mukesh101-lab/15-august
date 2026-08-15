const express = require("express");

const Visitor = require("../models/Visitor");
const Message = require("../models/Message");
const Firework = require("../models/Firework");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL STATS - ADMIN ONLY 🔐
// ==========================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            let visitor =
                await Visitor.findOne();

            if (!visitor) {

                visitor =
                    await Visitor.create({
                        count: 0
                    });

            }


            let firework =
                await Firework.findOne();

            if (!firework) {

                firework =
                    await Firework.create({
                        count: 0
                    });

            }


            const messageCount =
                await Message.countDocuments();


            res.json({

                success: true,

                data: {

                    visitors:
                        visitor.count,

                    fireworks:
                        firework.count,

                    messages:
                        messageCount

                }

            });

        } catch (error) {

            console.error(
                "Stats Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to get statistics"

            });

        }

    }
);


// ==========================================
// GET PUBLIC STATS - NO LOGIN REQUIRED 🌐
// ==========================================

router.get(
    "/public",
    async (req, res) => {

        try {

            let visitor =
                await Visitor.findOne();

            if (!visitor) {

                visitor =
                    await Visitor.create({
                        count: 0
                    });

            }


            let firework =
                await Firework.findOne();

            if (!firework) {

                firework =
                    await Firework.create({
                        count: 0
                    });

            }


            const messageCount =
                await Message.countDocuments();


            res.json({

                success: true,

                data: {

                    visitors:
                        visitor.count,

                    fireworks:
                        firework.count,

                    messages:
                        messageCount

                }

            });

        } catch (error) {

            console.error(
                "Public Stats Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to get public statistics"

            });

        }

    }
);


// ==========================================
// REGISTER VISITOR - PUBLIC 👥
// ==========================================

router.post(
    "/visitor",
    async (req, res) => {

        try {

            let visitor =
                await Visitor.findOne();


            if (!visitor) {

                visitor =
                    await Visitor.create({
                        count: 1
                    });

            } else {

                visitor.count += 1;

                await visitor.save();

            }


            res.json({

                success: true,

                visitors:
                    visitor.count

            });

        } catch (error) {

            console.error(
                "Visitor Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update visitor count"

            });

        }

    }
);


// ==========================================
// LAUNCH FIREWORK - PUBLIC 🎆
// ==========================================

router.post(
    "/firework",
    async (req, res) => {

        try {

            let firework =
                await Firework.findOne();


            if (!firework) {

                firework =
                    await Firework.create({
                        count: 1
                    });

            } else {

                firework.count += 1;

                await firework.save();

            }


            res.json({

                success: true,

                fireworks:
                    firework.count

            });

        } catch (error) {

            console.error(
                "Firework Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update fireworks"

            });

        }

    }
);


module.exports = router;