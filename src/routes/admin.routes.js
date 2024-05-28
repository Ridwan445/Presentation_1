const express = require("express")
const router = express.Router()

const {
  loginAdmin,
  adminRegistration,
  viewSetting,
  modifySetting,
  logoutAdmin,
} = require("../controllers/admin.controller")

router.post("/register-admin", adminRegistration)
router.post("/login-admin", loginAdmin)
router.get("/view-setting", viewSetting)
router.put("/modify-setting", modifySetting)
router.post("/logout-admin", logoutAdmin)
module.exports = router
