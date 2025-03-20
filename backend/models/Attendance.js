const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bankBranchName: { type: String, required: true },
  circle: { type: String, required: true },
  date: { type: String, required: true },
  checkIns: [{ type: String }],
  checkOuts: [{ type: String }],
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
