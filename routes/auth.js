const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth")
const bcryptjs = require('bcrypt');
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.get("/user", (req, res) => {
    res.json({ msg: "amit chandra is here" });
});

// signup route

authRouter.post('/user/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                msg: "User with the same email already exists"
            });
        }
const hashedPassword = await bcryptjs.hash(password, 8);


        let user = new User({
            email,
            password:hashedPassword,
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

// sign in route

authRouter.post("/user/signin", async (req, res) => {
    try {
        const {email, password } = req.body;
        console.log("email --->", email);

        console.log("Received request with email:", email);

        const user = await User.findOne({ email });

        console.log("Found user in the database:", user);

        if (!user) {
            return res.status(400).json({
                msg: "User not found",
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        console.log("Password match result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({
                msg: "Sorry, invalid credentials",
            });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");

        res.status(200).json({
            token, ...user._doc
        });

    } catch (e) {
        console.error("Error in signin route:", e);
        res.status(500).json({ error: e.message });
    }
});

//token checking

authRouter.post("/tokenIsValid", async (req, res)=>{
try{
const token = req.header('x-auth-token');
if(!token) return res.json(false);
const verified = jwt.verify(token, 'passwordkey');

if(!verified) return res.json(false);

const user = await User.findById(verified.id);
if(!user) return res.json(false);
res.json(true);



}catch(e){
res.status(500).json({
    error: e.message
});

}

});

/// get user data

authRouter.get('/', auth, async(req, res)=>{
    const user = await User.findById(req.user);
    res.json({...User._doc, token: req.token});
})


module.exports = authRouter;
