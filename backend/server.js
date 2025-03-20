require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const excelRoutes =require("./routes/excelRoutes")


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

console.log("🔹 Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.use("/employees", employeeRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/data",excelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
