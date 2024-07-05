const mongoose = require("mongoose");

const ParcelInputSchema = new mongoose.Schema(
  {
    parcel: Array,
    parcel_count: String,
    date: String,
    parcel_type: String,
  },
  {
    collection: "parcels",
  }
);

mongoose.model("parcelInput", ParcelInputSchema);
