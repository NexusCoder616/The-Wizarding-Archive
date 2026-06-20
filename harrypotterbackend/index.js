const express=require('express');
const app=express()
const connectDb=require("./config/db")
const authRoute=require("./router/authRouter")
const characterRoute=require("./router/characterRoute")
require("dotenv").config()
app.use(express.json())
connectDb()
app.use("/auth",authRoute)
app.use("/api/v1", characterRoute)
app.get("/",(req,res)=>{
    res.send("Server is Running")
})
app.listen(process.env.PORT,()=>{
    console.log(`Server Started On Port ${process.env.PORT}`)
})


console.log("Balayya")

