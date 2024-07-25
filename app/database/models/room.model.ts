import { timeStamp } from "console";
import mongoose, { Mongoose, Schema } from "mongoose";


const roomSchema = new Schema({
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
        creatorId: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    }],
},{timestamps:true})


const Room =mongoose.models["Room"]||mongoose.model("Room",roomSchema)

export default Room