const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

// Debugging middleware to log every request to this route
router.use((req, res, next) => {
  console.log(`🟢 Received request: ${req.method} ${req.url}`);
  next();
});

// Add Employee API
router.post("/add", async (req, res) => {
  console.log("🔹 Request Body:", req.body); // Log the incoming request body

  const { name, bankBranchName, circle } = req.body;

  try {
    if (!name || !bankBranchName || !circle) {
      console.log("❌ Missing fields in request");
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEmployee = new Employee({ name, bankBranchName, circle });
    await newEmployee.save();
    
    console.log("✅ Employee saved:", newEmployee);
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    console.error("❌ Error saving employee:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
