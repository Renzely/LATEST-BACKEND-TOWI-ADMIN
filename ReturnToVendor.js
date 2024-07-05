const mongoose = require("mongoose");

const RTVDetailSchema = new mongoose.Schema(
  {
    userEmail: String,
    date: String,
    merchandiserName: String,
    outlet: String,
    category: String,
    contactNum: String,
    item: String,
    quantity: String,
    driverName: String,
    plateNumber: String,
    pullOutReason: String,
  },
  {
    collection: "TowiReturnToVendor",
  }
);

mongoose.model("TowiReturnToVendor", RTVDetailSchema);
