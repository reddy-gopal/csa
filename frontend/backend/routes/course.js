const express = require("express")
const {Router} = express
const courseRouter = Router()
const {CourseModel, PurchaseModel} = require("../db")
const jwt = require("jsonwebtoken")
courseRouter.use(express.json())
function userAuth(req, res, next){
    const token = req.headers.token
    const response = jwt.verify(token, JWT_USER_SECRET);


if(response){
    req.userId = response.id;
    next()
}
else {
    res.json({
        message: "Incorrect credits"
    })
}

}

courseRouter.get("/preview",async function(req, res){
    const courses = await CourseModel.find({})
    res.json({
        courses
    })

    
    
})
courseRouter.post("/purchase",userAuth,async function(req, res){
    const userId = req.userId
    const courseId = req.body.courseId
    const purchased = await PurchaseModel.find({
        userId, courseId
    })
    if (purchased.length > 0){
        res.json({
            message: "You already Purchased the Course"
        })
    }else {
        await PurchaseModel.create({
            userId,
            courseId
        })
    
        res.json({
            message: "You have successfully purchased the Course"
        })

    }
    

    
})

module.exports = {
    courseRouter: courseRouter
}
