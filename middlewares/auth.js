// auth, isStudent,isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    try{
        //extract JWT token
        // Three ways to fetch token

        console.log("cookie" , req.cookies.token);
        console.log("body" , req.body.token);
        console.log("header", req.header("Authorization"));
       
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", ""); // Three ways to fetch Token, header is more secure way because it follows certain formt to fetch token as we can see here
        
        if(!token || token === undefined) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            // why this ?
            req.user = payload; // authenticate karte time request me payload dal diya, taki authorization ke time role check kar sake in isStudent & isAdmin middlewares below
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
            error:error.message,
        });
    }
   
}


exports.isStudent = (req,res,next) => {
    try{
            if(req.user.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'THis is a protected route for students',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'THis is a protected route for admin',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}