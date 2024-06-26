const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: true
    },
    isRegistered: {
   type: Boolean,
   default: true
  },
  role: {
    type: String,
    enum: ["student","Admin", "teacher"],
    default: "Admin",
  },
},
  {
    timestamps: true,
  }
);

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;