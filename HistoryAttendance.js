const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userEmail: String,
  date: Date,
  timeIn: Date,
  timeOut: Date,
}, {
  collection: "TowiAttendances",
});

const Attendance = mongoose.model("TowiAttendances", AttendanceSchema);
