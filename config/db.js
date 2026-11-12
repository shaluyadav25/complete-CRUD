
import mongoose from "mongoose";

const ConnectDB = async () => {
    if (!process.env.Mongo_URL) {
        console.log("MongoDB URL is missing");
        return;
    }

    try {
        await mongoose.connect(process.env.Mongo_URL);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
        
    }
};

export default ConnectDB;
