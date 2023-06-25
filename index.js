const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

//cookie-parser - what is this and why we need this ?

const cookieParser = require("cookie-parser");
app.use(cookieParser());  // to parse data in cookie

app.use(express.json()); // to parse data in request body

require("./config/database").connect();

//route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//actuivate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})
app.get("/",(req, res)=>{res.send(`<center><h1>Home sweet home</h1></center>`)})