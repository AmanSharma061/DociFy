import { timeStamp } from "console";
import mongoose, { Mongoose, Schema } from "mongoose";


const roomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userAccess: [{
        email: {
            type: String,
            required: true
        },
        accessType: {
            type: String,
            required: true
        },
    }],
}, { timestamps: true })


const Room = mongoose.models["Room"] || mongoose.model("Room", roomSchema)

export default Room