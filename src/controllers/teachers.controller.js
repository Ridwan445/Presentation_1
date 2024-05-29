const teacherModel = require("../models/teachers.model")
const assignmentModel = require("../models/assignment.model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const submissionModel = require("../models/submission.model");


const registerTeacher =  async (req, res) => {
  const {name, email, password, phone} = req.body
  try { 
    if(!name && !email && !password && !phone){
      return res.status(400).json({message: " 🔥 PLEASE FILL THIS FIELD"})
    }
    const teacherExist = await teacherModel.findOne({email})
    if(teacherExist){
      return res.status(409).json({success: false, message: "🔥 USER ALREADY EXIST"})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newTeacher = await teacherModel.create({
      name,
      email,
      password: hashPassword,
      phone,
 
    })
    return res.status(201).json({messsge:`TEACHER  REGISTERED SUCCESSSFULLY`, data: newTeacher})
  
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}
const updateTeacher = async (req, res) => {
  const teacherId = req.params.id
  const isRegistered = req.body;
  try {
    
    if (!isRegistered)
      return res.status(400).json({ error: "PLEASE INPUT ALL FIELDS" });

      const teacher = await teacherModel.findById(teacherId);
      if (!teacherId)
        return res.status(404).json({
          error: "THIS TEACHER NAME DOES NOT EXIST",
        });

        if (isRegistered) teacher.isRegistered = true;
    

        await teacher.save();

    return res.status(200).json({
      message: "TEACHER INFORMATION IS UPDATED SUCCESSFULLY",
      teacher,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const teachersLogin = async (req, res) => {
  const api_key = "teacher"
const auth = req.headers["api-key"]
if(auth !== api_key){
  return res.status(401).json({message: "ONLY TEACHERS CAN USE THIS ROUTES"})
}
  const {email, password} = req.body
  try {
    if (!email && !password) {
      return res.status(400).json("🔥 FILL THIS FIELD")
    }
    const user = await teacherModel.findOne({email})
    if (!user){
      return res.status(404).json("🔥 USER DOES NOT EXIST")
    }
    const comparedPassword = await bcrypt.compare(password, user.password)
    if(!comparedPassword){
      return res.status(404).json("🔥 INVALID PASSWORD")
    }
    const teacherPayload = {
      id: user._id,
      role: user.role
    };
    const token = jwt.sign(teacherPayload, process.env.SECRET_KEY, { expiresIn: "1d" });
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

const sackedTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const teacherId = req.user.id
    const user = await teacherModel.findById(teacherId);

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'ONLY ADMIN CAN SACK TEACHER' });
    }

    const deleteTeacher = await teacherModel.findByIdAndDelete(id);
    return res.status(200).json({ message: `TEACHER WITH ${id} IS SACKED`, data: deleteTeacher });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

const postAssignment = async (req, res) => {
  const api_key = "teacher"
  const auth = req.headers["api-key"]
  if(auth !== api_key){
    return res.status(401).json({message: "ONLY TEACHERS CAN USE THIS ROUTES"})
  }
  const { subject, description, dueDate } = req.body;
  const assignment = await assignmentModel.create({
    subject,
    description,
    dueDate,
  });

  try {
    const savedAssignment = await assignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const gradeAssignment = async (req, res) => {
    const api_key = "teacher"
    const auth = req.headers["api-key"]
    if(auth !== api_key){
      return res.status(401).json({message: "ONLY TEACHERS CAN USE THIS ROUTES"})
    }
    const { id } = req.params;
    const { graded, passed, } = req.body;
  
    try {
      const submission = await submissionModel.findById(id)
  
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }
  
     if(graded) submission.graded = true;
      if(passed) submission.passed = true
      const updatedSubmission = await submission.save();
  
      res.status(200).json(updatedSubmission);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}

const teacherLogout = async (req, res) => {
  try { 
    const api_key = "teacher";

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
  registerTeacher,
  updateTeacher,
  sackedTeacher,
  teachersLogin,
  postAssignment,
  teacherLogout,
  gradeAssignment
}