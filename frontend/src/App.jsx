import React from "react";
import QRScanner from "./components/QRScanner";

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Attendance Management System</h1>
      <QRScanner />
    </div>
  );
};

export default App;
