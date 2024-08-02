const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userEmail: String,
  date: Date,
  timeIn: Date,
  timeOut: Date,
}, {
  collection: "TowiAttendances",
});

mongoose.model("TowiAttendances", AttendanceSchema);

