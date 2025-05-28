const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId



const userSchema = new Schema({
    email:String,
    password: String,
    firstname: String,
    lastname: String
})
const adminSchema = new Schema({
    email:String,
    password: String,
    firstname: String,
    lastname: String
})
const courseSchema = new Schema({
    title:String,
    description: String,
    price: String,
    imageURL: String,
    creatorId: ObjectId
})
const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId:ObjectId
})
const UserModel = mongoose.model("users", userSchema);
const AdminModel = mongoose.model("admins", adminSchema);
const CourseModel = mongoose.model("courses", courseSchema);
const PurchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = { UserModel, AdminModel, CourseModel, PurchaseModel };