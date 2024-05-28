const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    parentPhoneNum: {
      type: String,
      required: true
    },
    isRegistered: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["Admin","student", "teacher"],
      default: "student",
    },
    Assignment : {
      type: String,
    },
    content : {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
