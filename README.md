# Attendance Management System

## 📌 Project Overview
The **Attendance Management System** is a MERN stack application that allows employees to mark their attendance using QR codes. The system records check-ins and check-outs, maintains attendance history, and generates reports.

## 🚀 Live Demo
[Attendance Management System](https://attendance-management-system-xi-ashy.vercel.app/)

## 🛠️ Features
- QR Code-based Check-in and Check-out
- Automatic Time Stamping (Indian Standard Time - IST)
- Employee Database Management
- CSV Export of Attendance Reports
- Real-time Data Storage with MongoDB
- RESTful API for Attendance Handling

## ⚙️ Tech Stack
- **Frontend:** React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **State Management:** Redux Toolkit

## 📂 Project Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/attendance-management-system.git
cd system
```

### 2️⃣ Install Dependencies
#### Install frontend dependencies:
```sh
cd client
npm install
```
#### Install backend dependencies:
```sh
cd ../server
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the **server** folder and add:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4️⃣ Start the Application
#### Run Backend:
```sh
cd backend
npm start
```
#### Run Frontend:
```sh
cd frontend
npm start
```

### 5️⃣ Access the App
Visit `http://localhost:3000/` in your browser.

## 📊 API Endpoints
| Method | Endpoint          | Description               |
|--------|------------------|---------------------------|
| POST   | `/api/attendance/check` | Mark attendance via QR code |
| GET    | `/api/attendance/report` | Fetch attendance records |



## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

## 📧 Contact
For any issues, reach out at: **your-email@example.com**

