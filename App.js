const express=require("express")
require("dotenv").config()
const connection=require("./Connection/db");
const userRoute=require("./Route/userRoute")
const productRoute=require("./Route/ProductRoute")
const cartRoute=require("./Route/cartRoute")
const auth=require("./middleware/auth")
const app=express()
app.use(express.json())

app.use("/user",userRoute)
app.use(auth)
app.use("/product",productRoute)
app.use("/cart",cartRoute)





app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("connected to DATABASE");
    } catch (error) {
        console.log(error);
        
        
    }
    console.log(`server is running on port ${process.env.port}`);
})
