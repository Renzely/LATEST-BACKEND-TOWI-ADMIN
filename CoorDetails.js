const mongoose = require("mongoose");

const CoorDetailsSchema = new mongoose.Schema({
  coorEmailAdd: String,
  merchandiserHandle: [{
    MerchandiserEmail: String,
  }]
}, {
  collection: "TowiCoordinator",
});

const CoorDetails = mongoose.model("TowiCoordinator", CoorDetailsSchema);