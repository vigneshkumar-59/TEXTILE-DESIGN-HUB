const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userModel = require("../models/userModel.js");
const crypto = require('crypto');
const { sendConfirmationEmail } = require("../utlis/sendEmail.js");

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//register user

// const registerUser = async (req,res) => {
//     const {name, email, password} = req.body;
//     try{
//         //check if user already exists
//         const exists = await userModel.findOne({email})
//         if(exists){
//             return res.json({success:false,message: "User already exists"})
//         }

//         // validating email format & strong password
//         if(!validator.isEmail(email)){
//             return res.json({success:false,message: "Please enter a valid email"})
//         }
//         if(password.length<8){
//             return res.json({success:false,message: "Please enter a strong password"})
//         }

//         // hashing user password
//         const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const newUser = new userModel({name, email, password: hashedPassword})
//         const user = await newUser.save()
//         const token = createToken(user._id)
//         res.json({success:true,token})

//     } catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new userModel({ name, email, password: hashedPassword, confirmationToken });
        const user = await newUser.save();

        // Send confirmation email
        const confirmationUrl = `http://localhost:4000/api/user/confirm/${confirmationToken}`;
        await sendConfirmationEmail(email, confirmationUrl);

        res.json({ success: true, message: 'Registration successful. Please check your email for confirmation.' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};




const getConfirmationToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Find user by confirmation token
        const user = await userModel.findOne({ confirmationToken: token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid confirmation token." });
        }

        // Activate the user account
        user.isActive = true;
        user.confirmationToken = null; // Clear the token after confirmation
        await user.save();

        res.json({ success: true, message: "Your account has been confirmed!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error confirming account." });
    }
};



module.exports = {
    loginUser,
    registerUser,
    getConfirmationToken
}