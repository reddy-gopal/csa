const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const app = express();

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

// Routers
const { userRouter } = require("./routes/user.js");
const { courseRouter } = require("./routes/course.js");
const { adminRouter } = require("./routes/admin.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/user", userRouter);
app.use("/courses", courseRouter);
app.use("/admin", adminRouter);

// Page Routes (Frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/User/Login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public/User/SignUp.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Home/Home.html"));
});

app.get("/purchases", (req, res) => {
  res.sendFile(path.join(__dirname, "public/User/Purchased.html"));
});

app.get("/adminLogin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Admin/Login.html"));
});

app.get("/adminSignup", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Admin/SignUp.html"));
});

app.get("/courses", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Admin/Courses.html"));
});

// Connect to MongoDB and start server
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

main();
