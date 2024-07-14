import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({

    name: {type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    image:{type:String, required:true},
    category:{type:String, required:true}

})

const foodModel = mongoose.model.food || mongoose.model("food", foodSchema); // phele se koi entry hoga to whi use kr lega or entry nhi hoga to new create krenge

export default foodModel;