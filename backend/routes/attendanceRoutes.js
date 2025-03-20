const express = require("express");
const fs = require("fs");
const path = require("path");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { parse } = require("json2csv");
const csvParser = require("fast-csv");

const router = express.Router();
const folderPath = path.join(__dirname, "../attendance_reports");
const FILE_PATH = path.join(folderPath, "Attendance_Report.csv");

// Ensure folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Function to parse QR data correctly
const parseQrData = (qrData) => {
  const data = {};
  qrData.split(/,|\n/).forEach((line) => {
    let [key, value] = line.split(":").map((item) => item.trim());
    if (key && value) {
      key = key.toLowerCase().replace(/ /g, ""); // Normalize key
      data[key] = value;
    }
  });
  return {
    name: data["employeename"] || null,
    bankBranchName: data["bankbranchname"] || null,
    circle: data["circle"] || null,
  };
};

// Mark Attendance (Alternating Check-in & Check-out)
router.post("/check", async (req, res) => {
  try {
    let { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ message: "QR data is missing" });
    }

    let { name, bankBranchName, circle } = parseQrData(qrData);
    console.log("🔹 Parsed QR Data:", { name, bankBranchName, circle });

    if (!name || !bankBranchName || !circle) {
      return res.status(400).json({ message: "Invalid QR data format" });
    }

    // Find employee
    const employee = await Employee.findOne({
      name: new RegExp(`^${name}$`, "i"),
      bankBranchName: new RegExp(`^${bankBranchName}$`, "i"),
      circle: new RegExp(`^${circle}$`, "i"),
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const today = new Date().toLocaleDateString("en-GB"); // "DD/MM/YYYY"
const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });

    let attendance = await Attendance.findOne({ name, bankBranchName, circle, date: today });

    if (!attendance) {
      // ✅ First scan of the day → Check-in
      attendance = new Attendance({
        name,
        bankBranchName,
        circle,
        date: today,
        checkIns: [currentTime],
        checkOuts: [],
      });
      console.log(`✅ First check-in recorded: ${currentTime}`);
    } else {
      const checkIns = attendance.checkIns.length;
      const checkOuts = attendance.checkOuts.length;

      console.log("📌 Current Attendance Data:", attendance);

      if (checkIns === checkOuts) {
        // ✅ If check-ins and check-outs are equal → Next scan is check-in
        attendance.checkIns.push(currentTime);
        console.log(`🔺 Check-in recorded: ${currentTime}`);
      } else {
        // ✅ If check-ins are more than check-outs → Next scan is check-out
        attendance.checkOuts.push(currentTime);
        console.log(`🔻 Check-out recorded: ${currentTime}`);
      }
    }

    // Save to DB
    await attendance.save();

    // ✅ Verify correct saving
    const savedAttendance = await Attendance.findOne({ name, bankBranchName, circle, date: today });
    console.log("📌 Saved Attendance in DB:", savedAttendance);

    // ✅ Update CSV file
    let records = [];
    if (fs.existsSync(FILE_PATH)) {
      records = await new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(FILE_PATH)
          .pipe(csvParser.parse({ headers: true }))
          .on("data", (row) => rows.push(row))
          .on("end", () => resolve(rows))
          .on("error", reject);
      });
    }

    let existingRecord = records.find(
      (row) => row.Name === name && row.BankBranch === bankBranchName && row.Circle === circle && row.Date === today
    );

    if (existingRecord) {
      existingRecord["Check-Ins"] = attendance.checkIns.join(" | ");
      existingRecord["Check-Outs"] = attendance.checkOuts.join(" | ");
    } else {
      records.push({
        Name: name,
        BankBranch: bankBranchName,
        Circle: circle,
        Date: today,
        "Check-Ins": attendance.checkIns.join(" | "),
        "Check-Outs": attendance.checkOuts.join(" | "),
      });
    }

    const csvData = parse(records, { fields: ["Name", "BankBranch", "Circle", "Date", "Check-Ins", "Check-Outs"] });
    fs.writeFileSync(FILE_PATH, csvData);

    console.log("✅ CSV File Updated Successfully");

    res.json({
      message: "Attendance updated successfully",
      attendance: {
        name: employee.name,
        bankBranchName: employee.bankBranchName,
        circle: employee.circle,
        date: attendance.date,
        checkIns: attendance.checkIns,
        checkOuts: attendance.checkOuts,
      },
    });
  } catch (error) {
    console.error("🚨 Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
