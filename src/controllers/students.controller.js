const studentModel = require("../models/students.model")
const assignmentModel = require("../models/assignment.model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');


const registerStudents =  async (req, res) => {
  const api_key = "admin";
 
  let auth = req.headers["api-key"];
  if (auth !== api_key)
    return res.status(401).json({ error: "ONLY ADMIN CAN REGISTERED STUDENT"});
  const {name, email, password, parentPhoneNum} = req.body
  try { 
    if(!name && !email && !password && !parentPhoneNum){
      return res.status(400).json({message: " 🔥 PLEASE FILL THIS FIELDS"})
    }
    const studentExist = await studentModel.findOne({email})
    if(studentExist){
      return res.status(409).json({success: false, message: "🔥 STUDENT ALREADY EXIST"})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newStudent = await studentModel.create({
      name,
      email,
      password: hashPassword,
      parentPhoneNum,
 
    })
    return res.status(201).json({messsge:`STUDENT  REGISTERED SUCCESSSFULLY`, data: newStudent})
  
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}
const updateStudents = async (req, res) => {
  const api_key = "admin"
const auth = req.headers["api-key"]
if(auth !== api_key){
  return res.status(401).json({message: "ONLY STUDENTS CAN USE THIS ROUTES"})
}
  const studentId = req.params.id
  const { name, parentPhoneNum } = req.body;
  try {
    
    if (!name && !parentPhoneNum)
      return res.status(400).json({ error: "PLEASE INPUT ALL FIELDS" });

      const student = await studentModel.findById(studentId);
      if (!studentId)
        return res.status(404).json({
          error: "STUDENT WITH THE ID " + student + " DOES NOT EXIST",
        });

        if (name) student.name = name;
        if (parentPhoneNum) student.parentPhoneNum = parentPhoneNum;
    

    return res.status(200).json({
      message: "STUDENT INFORMATION UPDATED SUCCESSFULLY",
      student,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const expelledStudents = async (req, res) => {
  const api_key = "admin";
 
  let auth = req.headers["api-key"];
  if (auth !== api_key)
    return res.status(401).json({ error: "ONLY ADMIN CAN USE THIS ROUTES"});
  try {
    const id = req.params.id;
    const studentId = req.user.id
    const user = await studentModel.findById(studentId);
if (!user) return res.status(404).json({message: "STUDENT NOT FOUND"})
    const deleteStudent = await studentModel.findByIdAndDelete(id);
    return res.status(200).json({ message: `STUDENT WITH ${id} EXPELLED`, data: deleteStudent });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

const studentLogin = async (req, res) => {
const api_key = "student"
const auth = req.headers["api-key"]
if(auth !== api_key){
  return res.status(401).json({message: "ONLY STUDENTS CAN USE THIS ROUTES"})
}
  const {email, password} = req.body
  try {
    if (!email && !password) {
      return res.status(400).json("🔥 FILL THIS FIELD")
    }
    const user = await studentModel.findOne({email})
    if (!user){
      return res.status(404).json("🔥 USER DOES NOT EXIST")
    }
    const comparedPassword = await bcrypt.compare(password, user.password)
    if(!comparedPassword){
      return res.status(404).json("🔥 INVALID PASSWORD")
    }
    const studentPayload = {
      id: user._id,
      role: user.role
    };
    const token = jwt.sign(studentPayload, process.env.SECRET_KEY, { expiresIn: "1d" });
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

const viewProfile = async (req, res) => {
const api_key = "student"
const auth = req.headers["api-key"]
if(auth !== api_key){
  return res.status(401).json({message: "ONLY STUDENTS CAN USE THIS ROUTES"})
}
  const studentName = req.params.id
try {
  const student = await studentModel.findOne({studentName})
  res.status(200).json(student)
} catch (error) {
  res.status(500).json(error)
}
}

const manageStudentProfile = async (req, res) => {
  const api_key = "teacher"
  const auth = req.headers["api-key"]
  if(auth !== api_key){
    return res.status(401).json({message: "ONLY TEACHERS CAN USE THIS ROUTES"})
  }
  const studentId = req.params.id
  const {isRegistered} = req.body;
  try {
    if (!isRegistered)
      return res.status(400).json({ error: "PLEASE INPUT ALL FIELDS" });

      const student = await studentModel.findById(studentId);
      if (!studentId)
        return res.status(404).json({
          error: "STUDENT WITH THE ID " + student + " DOES NOT EXIST",
        });

        if (isRegistered) student.isRegistered = isRegistered;
    

    return res.status(200).json({
      message: "STUDENT INFORMATION UPDATED SUCCESSFULLY",
      student,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const viewStudentProfile = async (req, res) => {
const api_key = "teacher"
const auth = req.headers["api-key"]
if(auth !== api_key){
  return res.status(401).json({message: "ONLY TEACHERS CAN USE THIS ROUTES"})
}
  try {
    const student = await studentModel.find({})
    res.status(200).json({message: student})
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
  }

const submitAssignment = async (req, res) => {
const api_key = "student"
const auth = req.headers["api-key"]
if(auth !== api_key){
  return res.status(401).json({message: "ONLY STUDENTS CAN USE THIS ROUTES"})
}
  try {
    const assignmentId = req.params.id
   const assignment = await assignmentModel.findById(assignmentId)
     if(!assignmentId) return res.status(400).json({error: "Assignment not seen"})
      const {submittedBy, answer, passed, graded} = req.body
      const submit = await assignmentModel.create({
        submittedBy,
        answer,
        passed,
        graded,
      })
    res.status(201).send({message: 'Assignment submitted successfully By', data: submit, assignment});
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
}

  const studentLogout = async (req, res) => {
    const api_key = "student";
    try { 
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
  registerStudents,
  updateStudents,
  expelledStudents,
  viewProfile,
  viewStudentProfile,
  studentLogin,
  submitAssignment,
  manageStudentProfile,
  studentLogout
}