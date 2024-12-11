import mongoose from "mongoose";

// DB Schema (In mongo db we need to create a schema first)
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passWord: {
        type: String,
        required: true
    }
}, { timestamps: false })

// DB Model
const User = mongoose.models.users || mongoose.model('users', userSchema)
export default User