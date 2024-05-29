const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
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
    phone : {
      type: String,
      required: true
    },
    isRegistered: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["student","teacher", "Admin"],
      default: "teacher",
    },
    title : {
      type: String,
      required: false
    },
    content : {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const teacherModel = mongoose.model("teacher", teacherSchema);

module.exports = teacherModel;