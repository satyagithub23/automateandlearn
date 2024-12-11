import mongoose, { connect } from 'mongoose'

// Connecting to mongo db
connect("mongodb://automatrix:me-Mongodb123@64.227.137.47:27017/automateandlearn?authSource=admin")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo DB not connected", err))


export default mongoose