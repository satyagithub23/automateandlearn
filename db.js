const mongoose = require('mongoose')

// Connecting to mongo db
mongoose.connect("mongodb://automatrix:me-Mongodb123@localhost:27017/automateandlearn?authSource=admin")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo DB not connected", err))


module.exports = mongoose
