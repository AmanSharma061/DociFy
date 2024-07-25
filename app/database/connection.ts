import mongoose from "mongoose";



const connectDB=async()=>{
    try {
        await mongoose.connect(String(process.env.DATABASE_UR))
    } catch (error) {
        console.log(`Error connecting database`,error)
    }
}

export {connectDB}