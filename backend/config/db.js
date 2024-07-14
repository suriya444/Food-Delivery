import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://food:food@cluster0.diqzqiq.mongodb.net/food-delivery').then (() => console.log("DB Connected"));
}