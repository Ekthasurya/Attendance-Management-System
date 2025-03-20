const express = require("express");
const fs = require("fs");
const path = require("path");
const Attendance = require("../models/Attendance");
const { parse } = require("json2csv");

const router = express.Router();

router.get("/download-report", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });

    if (!records.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    const csvData = parse(records, {
      fields: ["name", "bankBranchName", "circle", "date", "checkIns", "checkOuts"],
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=Attendance_Report.csv");
    res.status(200).send(csvData);
  } catch (error) {
    console.error("🚨 Error generating report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
