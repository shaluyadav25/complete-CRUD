import mongoose from "mongoose";
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
            trim:true,
        },
        email:{
            type:String,
            required:[true,"email is required"],
            lowercase:true,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required:[true,"password is required"],
            trim:true,
        },
        profileImage:{
            type:String,
        },
    },
    {timestamps:true}
)
export default mongoose.model("User",userSchema)