const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.get("/user", (req, res) => {
    res.json({ msg: "amit chandra is here" });
});

authRouter.post('/user/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                msg: "User with the same email already exists"
            });
        }

        let user = new User({
            email,
            password,
            name,
        });

        user = await user.save();
        res.status(200).json({
            msg: "Signup successfully done",
            user
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            msg: "Internal server error during signup"
        });
    }
});

module.exports = authRouter;
