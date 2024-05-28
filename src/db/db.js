const mongoose = require("mongoose")

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/school-portal")
    console.log("Connected to db");
  } catch (error) {
    return res.status(500).json(error)
  }
}

module.exports = dbConnect