import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Send QR Attendance Data to Backend
export const sendAttendance = createAsyncThunk(
  "attendance/sendAttendance",
  async (qrData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/attendance/check", { qrData });
      console.log("📡 API Response:", response.data); // ✅ Debugging log
      return response.data; // Includes { message, attendance }
    } catch (error) {
      console.error("🚨 API Error:", error);
      return rejectWithValue("Error: Unable to process attendance.");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    employee: null,
    message: "",
    status: "idle",
  },
  reducers: {
    clearMessage: (state) => { state.message = ""; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAttendance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendAttendance.fulfilled, (state, action) => {
        console.log("🔥 Redux Updated:", action.payload);

        state.status = "succeeded";
        state.message = action.payload.message;
        
        // ✅ Store the latest attendance object
        state.employee = action.payload.attendance || null;
      })
      .addCase(sendAttendance.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload;
        state.employee = null;
      });
  },
});

export const { clearMessage } = attendanceSlice.actions;
export default attendanceSlice.reducer;
