const express=require("express")
require("dotenv").config()
<<<<<<< HEAD
const connection=require("./connection/db");
const userRoute=require("./route/userRoute")
const productRoute=require("./route/productRoute")
const cartRoute=require("./route/cartRoute")
=======
const connection=require("./Connection/db");
const userRoute=require("./Route/userRoute")
const productRoute=require("./Route/ProductRoute")
const cartRoute=require("./Route/cartRoute")
>>>>>>> 1cf3d2e2665e318c652da958024aea88fddcd07c
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