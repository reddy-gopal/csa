const express = require("express")
const {Router} = express
const adminRouter = Router()
const jwt = require("jsonwebtoken")
adminRouter.use(express.json())
const bcrypt = require("bcrypt")
const {z} = require("zod");
const {AdminModel, PurchaseModel, CourseModel} = require("../db")

const {JWT_ADMIN_SECRET} = require("../config")


function Auth(req, res, next){
    const token = req.headers.token
    const response = jwt.verify(token, JWT_ADMIN_SECRET);


if(response){
    req.adminId = response.id;
    next()
}
else {
    res.json({
        message: "Incorrect credits"
    })
}

}

adminRouter.post("/signup", async function(req, res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(100),
        firstname: z.string().min(3).max(100),
        lastname: z.string().min(4).max(100),
        password: z.string().min(2).max(30)
    });

    let parsedData;
    try {
        parsedData = requiredBody.parse(req.body);
    } catch (err) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const { email, password, firstname, lastname } = parsedData;
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await AdminModel.create({
        email,
        password: hashedPassword,
        firstname,
        lastname
    });

    res.json({
        message: "Signed Up successfully."
    });
});

adminRouter.post("/signin",async function(req, res){
    const email = req.body.email
    const password = req.body.password
    const user = await AdminModel.findOne({
        email: email
    })
    if(!user){
        return res.json({
            message: "User not found"
        })
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(user && passwordMatch){
        const token = jwt.sign({
            id:user._id.toString()
        }, JWT_ADMIN_SECRET);
        res.json({
            token
        })
    }else {
        res.json({
            message: "Incorrect creds"
        })
    }
    

    
})
adminRouter.post("/course",Auth, async function(req, res){
    const adminId = req.adminId
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const imageURL = req.body.imageURL
    if (!title || !description) {
  return res.status(400).json({
    message: "Title and description cannot be empty"
  });
}
  
    const exists = await CourseModel.findOne({
        title, adminId
    })
    if (exists) {
        res.json({
          message: "This course already exists",
          courseID: exists._id
        });
      } else {
        const course = await CourseModel.create({
          title,
          description,
          price,
          imageURL,
          creatorId: adminId
        });
        res.json({
          message: `Course ${title} is added successfully...`,
          courseID: course._id
        });
      }
      



})
adminRouter.put("/course",Auth,async function(req, res){
    const adminId = req.adminId
    const {title,description, price, imageURL, courseId} = req.body
    if(!courseId){

      return  res.status(400).json({
            message: "Course Id is required for updating"
        })
    }
    const exist = await CourseModel.findOne({
        _id: courseId , creatorId: adminId
    })
    if(!exist){

           return res.status(400).json({
            message: "There are no Courses with the Course Id"
        })
    }
   
    const course = await CourseModel.updateOne(
        {_id: courseId , creatorId: adminId},
        {title, description, price, imageURL}
    )
    res.json({
        message: `Course ${title} is updated successfully`,
    })
    

    
})
adminRouter.get("/course/bulk",Auth, async function(req, res){
    const adminId = req.adminId
 
    const availableCourses =await CourseModel.find({
        creatorId: adminId
    })
    res.json({
        Available: availableCourses
    })
    
})

module.exports = {
    adminRouter: adminRouter
}

