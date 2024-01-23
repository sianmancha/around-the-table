import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        const mongodbUri = process.env.MONGODB_URI;

        if (!mongodbUri) {
            console.error("MongoDB_URI is not defined");
            return;
        }
        
        await mongoose.connect(mongodbUri)
        console.log("Connected to MONGODB")
    } catch (error) {
        console.log("Error Connecting to MongoDB:", error)
    }
}