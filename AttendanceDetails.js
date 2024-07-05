const mongoose = require("mongoose");

const AttendanceDetailSchema = new mongoose.Schema({
    user: String,
    attendance: Array
},{
    collection:"attendances"
});

mongoose.model("attendances", AttendanceDetailSchema);

