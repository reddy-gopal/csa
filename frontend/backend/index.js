const express = require("express")
const app =   express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const {userRouter } =  require("./routes/user.js")
const {courseRouter} = require("./routes/course.js")
const {adminRouter} = require("./routes/admin.js")

app.use("/user", userRouter)
app.use("/courses", courseRouter)
app.use("/admin", adminRouter)
app.use(express.json())
async function main(){
   await mongoose.connect(process.env.MONGO_URL)
   const port = process.env.PORT
   app.listen(port, ()=> console.log("Server is running on 3000"))
}
main();

app.get("/signup", function(req, res){
   res.sendFile(__dirname + "/public/User/SignUp.html")
})
app.get("/", function(req, res){
   res.sendFile(__dirname + "/public/User/Login.html")
})
app.get("/home", function(req, res){
   res.sendFile(__dirname + "/public/Home/Home.html")
})
app.get("/purchases", function(req, res){
   res.sendFile(__dirname + "/public/User/Purchased.html")
})
app.get("/adminLogin", function(req, res){
   res.sendFile(__dirname + "/public/Admin/Login.html")
})
app.get("/adminSignup", function(req, res){
   res.sendFile(__dirname + "/public/Admin/SignUp.html")
})
app.get("/courses", function(req, res){
   res.sendFile(__dirname + "/public/Admin/Courses.html")
})