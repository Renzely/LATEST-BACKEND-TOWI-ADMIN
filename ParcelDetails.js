const mongoose = require("mongoose");

const ParcelDetailSchema = new mongoose.Schema(
  {
    user: String,
    parcel: Array,
  },
  {
    collection: "parcels",
  }
);

mongoose.model("parcels", ParcelDetailSchema);
