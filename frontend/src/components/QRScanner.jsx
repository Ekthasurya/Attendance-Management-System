import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { useDispatch, useSelector } from "react-redux";
import { sendAttendance } from "../redux/attendanceSlice";
import { saveAs } from "file-saver";
import "./QRScanner.css";

const QRScanner = () => {
  const webcamRef = useRef(null);
  const [scanResult, setScanResult] = useState("");
  const dispatch = useDispatch();
  const { employee, message, status } = useSelector((state) => state.attendance);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const capture = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data !== scanResult) {
        setScanResult(code.data);
        console.log("📸 Scanned QR:", code.data);
        dispatch(sendAttendance(code.data)); // ✅ Send QR data to backend
      }
    };
  };

  // ✅ Fetch latest Excel file from backend
  const exportToExcel = async () => {
    try {
      const response = await fetch("https://attendance-management-system-ulg1.onrender.com/data/download-report"); // API call to get updated file
      const blob = await response.blob();
      saveAs(blob, "Attendance_Report.csv");
      console.log("✅ downloaded updated Excel file!");
    } catch (error) {
      console.error("🚨 Error downloading Excel:", error);
    }
  };

  return (
    <div className="container">
      <h2>Scan QR Code</h2>
      <Webcam ref={webcamRef} screenshotFormat="image/png" className="webcam"  />
      {scanResult && <p>Scanned QR: {scanResult}</p>}
      {status === "loading" && <p>Processing attendance...</p>}

      {employee && (
        <div className="employee-details">
          <h3>✅ Employee Details</h3>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Branch:</strong> {employee.bankBranchName}</p>
          <p><strong>Circle:</strong> {employee.circle}</p>
          <p><strong>Date:</strong> {employee.date}</p>

          <h4>📍 Check-In Times:</h4>
          {employee.checkIns.length > 0 ? (
            <ul>{employee.checkIns.map((time, index) => <li key={index}>✅ {time}</li>)}</ul>
          ) : <p>❌ No Check-In Yet</p>}

          <h4>🚪 Check-Out Times:</h4>
          {employee.checkOuts.length > 0 ? (
            <ul>{employee.checkOuts.map((time, index) => <li key={index}>🚪 {time}</li>)}</ul>
          ) : <p>❌ No Check-Out Yet</p>}

          {/* 🚀 Export to Excel Button */}
         
        </div>
      )}
       <button onClick={exportToExcel} className="export-btn">
            📊 Export to Excel
          </button>
    </div>
  );
};

export default QRScanner;
