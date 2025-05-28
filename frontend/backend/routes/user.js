const express = require("express")
const {Router} = express
const jwt = require("jsonwebtoken")
const userRouter = Router()
const bcrypt = require("bcrypt")
const {z} = require("zod");
const {UserModel, PurchaseModel} = require("../db")
userRouter.use(express.json())

const {JWT_USER_SECRET} = require("../config")

function Auth(req, res, next){
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

userRouter.post("/signup", async function(req, res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(100),
        firstname: z.string().min(3).max(100),
        lastname: z.string().min(2).max(100),
        password: z.string().min(6).max(30)
    });

    let parsedData;
    try {
        parsedData = requiredBody.parse(req.body);
    } catch (err) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const { email, password, firstname, lastname } = parsedData;
   

    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
        email,
        password: hashedPassword,
        firstname,
        lastname
    });

    res.json({
        message: "Signed Up successfully"
    });
});
userRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id.toString() }, JWT_USER_SECRET
           
        );

        return res.status(200).json({ token });

    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get("/purchases",Auth,async function(req, res){
    const userId = req.userId
    const purchased  = await PurchaseModel.find({
        userId
    })
    


    res.json({
        purchased
    })
    
})
module.exports = {
    userRouter: userRouter
}


