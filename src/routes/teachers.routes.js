const express = require("express")
const router = express.Router()
const authenticate = require("../middleware/auth")

const { 
  registerTeacher,
  updateTeacher,
  sackedTeacher,
  teachersLogin,
  postAssignment,
  teacherLogout,
  gradeAssignment

 } = require("../controllers/teachers.controller")

router.post("/register-teacher", authenticate, registerTeacher)
router.post("/login-teacher",  teachersLogin)
router.put("/update-teacher/:id", authenticate, updateTeacher)
router.delete("/delete-teacher/:id", authenticate, sackedTeacher)
router.post("/assignment/:id", postAssignment)
router.post("/logout-teacher", teacherLogout)
router.put("/grade-assignment/:id", gradeAssignment)

module.exports = router