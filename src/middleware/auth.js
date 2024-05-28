const jwt = require("jsonwebtoken")

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers["authorization"]
    if (!header) {
      return res.status(400).json({error: "NO AUTH HEADER FOUND - UNAUTHORIZED"})
    }
    const AdminToken = header.split(" ")[1]
    if (!AdminToken) {
      return res.status(401).json("🔐 TOKEN NOT FOUND")
    }
    const decoded = jwt.verify(AdminToken, process.env.SECRET_KEY)
    if (!decoded) {
      return res.status(401).json("UNAUTHORIZED ENTRY 🔥")
    }
   req.user = decoded

   next()
  } catch (error) {
    console.log(error)
   res.status(500).json(error)
  }
}

module.exports = authenticate
