import mongoose, { Schema } from 'mongoose';


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    clerkUserId: {
        type: String,
        reuqired: true
    }
}, {
    timestamps: true
})

const User =mongoose.models["User"]||mongoose.model("User",userSchema)

export default User
