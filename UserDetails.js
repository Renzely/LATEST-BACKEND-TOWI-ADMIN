const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    remarks: String,
    firstname: String,
    middleName: String,
    lastname: String,
    emailAddress: { type: String, unique: true },
    contactNum: String,
    username: String,
    password: String,
    isActivate: Boolean,
    accountNameBranchManning: [String],
  },
  {
    collection: "TowiDb",
  }
);

mongoose.model("TowiDb", UserDetailSchema);
