import mongoose from "mongoose";
const productSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
            trim:true,
        },
        price:{
            type:Number,
            required:true,
            min:0,
        },
        description:{
            type:String,
            default:""
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
            index:true,
        }
    },
    {timeStamp:true}
)
export default mongoose.model("Product",productSchema)