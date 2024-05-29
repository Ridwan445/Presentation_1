const express = require("express")
const router = express.Router()
const authenticate = require("../middleware/auth")

const { 
  registerStudents,
  updateStudents,
  expelledStudents,
  viewProfile,
  viewStudentProfile,
  studentLogin,
  submitAssignment,
  manageStudentProfile,
  studentLogout,

 } = require("../controllers/students.controller")

router.post("/register-student", authenticate, registerStudents)
router.put("/update-student/:id", authenticate, updateStudents)
router.delete("/delete-student/:id", authenticate, expelledStudents)
router.get("/profile/:name", viewProfile)
router.get("/all/students", authenticate, viewStudentProfile)
router.post("/login-student", studentLogin)
router.post("/submit-assignment", submitAssignment)
router.patch("/manage/student-account/:id", authenticate, manageStudentProfile)
router.post("/logout-student/:id", studentLogout)

module.exports = router