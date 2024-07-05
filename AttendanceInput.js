const mongoose = require("mongoose");

const AttendanceInputSchema = new mongoose.Schema({
    wdate: String,
    date: String,
    time_in: String,
    time_out: String,
    attendance: Array,
    time_in_coordinates: 
     {
        latitude: Number,
        longitude: Number
     },
    time_out_coordinates: 
     {
        latitude: Number,
        longitude: Number
     }
},{
    collection: "attendances"
});

mongoose.model("attendanceInput", AttendanceInputSchema);