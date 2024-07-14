import { error } from "console";
import foodModel from "../models/foodModels.js";
import fs from 'fs'

//add food item
const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save();
        res.json({success:true, message:"Food Added"})
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//all food list
const listFood = async(req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({
            success:true, 
            data:foods
        })
    } 
    catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error
        })
    }
}

//remove food item
const romoveFood = async(req, res) => {
    try {
        const food = await foodModel.findById(req.body.id); //using id it will find model
        fs.unlink(`uploads/${food.image}`, () => {}); //is line se folder se image delete hoga

        await foodModel.findByIdAndDelete(req.body.id); //is se database se data entry delete hoga
        res.json({
            success:true,
            message:"Food Removed"
        })
    } 
    catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}

export {addFood, listFood, romoveFood};