const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv")
dotenv.config()


const dbConnect = require("./db/db")
const app = express()

const adminRoutes = require("./routes/admin.routes")
const teacherRoutes = require("./routes/teachers.routes")
const studentRoutes = require("./routes/students.routes")

app.use(express.json())
app.use(morgan("dev"))

dbConnect()

app.use("/api/admin", adminRoutes)
app.use("/api/teacher", teacherRoutes)
app.use("/api/student", studentRoutes)

const port = process.env.PORT_NUMBER || 5050

app.use((req, res, next) => {
  const now = new Date();
  const reqHeader = req.headers["host"];
  const method = req.method;

  console.log(
    `Today's date is: ${now} -- Host: ${reqHeader} -- Method: ${method}`
  );
  next();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})