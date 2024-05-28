const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin.model");
const teacherModel = require("../models/teachers.model");


const adminRegistration  = async (req, res) => {
  const {name, email, password, phone, title} = req.body
  try {
    if (!name && !email && !password && !phone && !title) {
      return res.status(400).json("🔥 FILL ALL FIELDS")
    }
    const user = await adminModel.findOne({email})
    if (user) {
      return res.status(409).json({message: "🔥 USER ALREADY EXIST"})
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newAdmin = await adminModel.create({
      name,
      email,
      password: hashPassword,
      phone,
    })
    return res.status(201).json({success: true, message: "ADMIN REGISTERED SUCCESSFULLY", data: newAdmin})
  }
  catch (error) {
    console.log(error)
    res.status(500).json("internal server error")
  }
}

const loginAdmin = async (req, res) => {
const {email, password} = req.body
try {
  if (!email && !password) {
    return res.status(400).json("🔥 FILL THIS FIELD")
  }
  const user = await adminModel.findOne({email})
  if (!user){
    return res.status(404).json("🔥 USER DOES NOT EXIST")
  }
  const comparedPassword = await bcrypt.compare(password, user.password)
  if(!comparedPassword){
    return res.status(404).json("🔥 INVALID PASSWORD")
  }
  const adminPayload = {
    id: user._id,
    role: user.role
  };
  const token = jwt.sign(adminPayload, process.env.SECRET_KEY, { expiresIn: "1d" });
  const dataInfo = {
    email: user.email,
    userId: user._id,
    token: token
  }
  return res.status(200).json({message: "LOGGED IN SUCCESSFUL", data: dataInfo});
} catch (error) {
  console.log(error);
  res.status(500).json(error)
}
}

const viewSetting = async (req, res) => {
    try {
      const schoolSettings = await teacherModel.find({});
      res.json({ message: 'School settings viewed successfully', settings: schoolSettings });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
const modifySetting = async (req, res) => {
    const { settings } = req.body
    try {
     await studentModel.updateOne({}, { $set: { settings }});
    res.json({ message: 'School settings modified successfully' })
    } catch (error) {
      res.status(500)
    }
  }

const logoutAdmin = async (req, res) => {
    try { 
      const api_key = "admin";
 
  let auth = req.headers["api-key"];
  if (auth !== api_key)
    return res.status(401).json({ error: "Logout failed"});
  
    return res.status(200).json({message: "Logout successful"})
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Internal server error"})
    }
  }



module.exports = {
  adminRegistration,
  loginAdmin,
  viewSetting,
  modifySetting,
  logoutAdmin
}