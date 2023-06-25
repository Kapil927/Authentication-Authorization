const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true, //white spaces will be removed only from both sides of the string. ie - "ABC "  or  "     ABC  ", will be saved in the form "ABC" in DB
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin", "Student", "Visitor"] //enum is used for validation .  mtbl in teno me se hi kuch input lega. mongoose will take one of these strings as valid input, else will throw an validation error.
    }
});

module.exports = mongoose.model("user", userSchema);