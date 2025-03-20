const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bankBranchName: { type: String, required: true },
  circle: { type: String, required: true },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
