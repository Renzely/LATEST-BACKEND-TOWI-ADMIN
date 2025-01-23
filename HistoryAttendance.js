const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    userEmail: String,
    date: Date,
    accountNameBranchManning: String,
    timeLogs: [
      {
        timeIn: Date,
        timeOut: Date,
        timeInLocation: String,
        timeOutLocation: String,
        time_in_coordinates: {
          latitude: Number,
          longitude: Number,
        },
        time_out_coordinates: {
          latitude: Number,
          longitude: Number,
        },
        selfieUrl: { type: String, default: '' }, // For time-in selfie URL
        timeOutSelfieUrl: { type: String, default: '' }, // New field for time-out
      },
    ],
  },
  {
    collection: "TowiAttendances",
  }
);

const TowiAttendances = mongoose.model("TowiAttendances", AttendanceSchema);

module.exports = TowiAttendances;

// const mongoose = require("mongoose");

// const AttendanceSchema = new mongoose.Schema({
//   userEmail: String,
//   date: Date,
//   timeIn: Date,
//   timeOut: Date,
//   timeInlocation: String,
//   timeoutlocation: String,
// }, {
//   collection: "TowiAttendances",
// });

// mongoose.model("TowiAttendances", AttendanceSchema);

