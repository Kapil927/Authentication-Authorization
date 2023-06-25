const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const { options } = require("../routes/user");
require("dotenv").config();

//signup route handler
exports.signup = async (req,res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        //check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10); // ab db me koi seedha original password thodi store hoga use 10 rounds/ passes me  hash kiya hai, phir store kiya hai
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}


//login
exports.login = async (req,res) => {
    try {

        //data fetch
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:'PLease fill all the details carefully',
            });
        }

        //check for registered user
        let user = await User.findOne({email});
        //if not a registered user
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }

        const payload = { // jis data se hum apna Token bnana chahte hai
            email:user.email,
            id:user._id,
            role:user.role,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password,user.password) ) {
            //password match
            let token =  jwt.sign(payload,                    // after successful login server , signs the token with is secret key , phir vo token vo client ko dedeta hai, ab jo bhi request maren ge isi token se maren ge tKI BAR BAR ID , PASS se login na karna pade vo requst me token dekhke samjh jae ga ise authenticate nahi karna    
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });

                                
            user = user.toObject();
            user.token = token ; //user ke object me token add kardo
            user.password = undefined ; // user ka jo object bnaya tha usme se htaya password. response me ye bhi bhej rahe hai to pass hta diya vena hacker ko mil jae gaa  db se nahi htaya

            const options = {
                expires: new Date( Date.now() + 3*24*60*60*1000), // Date.now() mtlb aaj  se leke +  (3 * 24 * 60 * 60 * 1000) - mtlb 3 din tak, milisecond me dala hai
                httpOnly: true, // client side pe access naahi hoga
            }

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });

            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:'User Logged in successfully',
            // });
        }
        else {
            //passwsord do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });

    }
}