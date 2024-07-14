import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator'


//-----------login user------------
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        //if user exist
        const user = await userModel.findOne({email});

        //user not exist
        if (!user) {
            return res.json({
                success:false,
                message:"User doesn't exists"
            })
        }

        //if user exist
        const isMatch = await bcrypt.compare(password, user.password); //check kiya password jo avi dale login ke liye or jo phele se store tha database me password us se
        //if password is wrong
        if (!isMatch) {
            return res.json({
                success:false,
                message:"Invalid credentials"
            })
        }

        //is password match
        const token = createToken(user._id);
        return res.json({
            success:true,
            token
        })
    } 
    catch (error) {
        console.log(error);
        return res.json({
            success:false,
            message:"Error"
        })
    }
}

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// ---------register user-----------
const registerUser = async(req, res) => {
    const {name, password, email} = req.body;
    
    try {
        //checking is user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({
                success:false,
                message:"User already exists"
            })

            }

        //validating email formar and strong password
        if(!validator.isEmail(email)){
            return res.json({
                    success:false,
                    message:"Please enter a valid email"
            })
        }

        if(password.length < 8){
            return res.json({
                success:false,
                message:"Please enter strong password"
            })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save();  //yaha jo new user bnaye usko save kiye hai
        const token = createToken(user._id)
        res.json({
            success:true,
            token
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

export {loginUser, registerUser};