const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    roleAccount: String,
    remarks: String,
    firstName: String,
    middleName: String,
    lastName: String,
    emailAddress: { type: String, unique: true },
    contactNum: String,
    username: String,
    password: String,
    isActivate: Boolean,
    accountNameBranchManning: [String],
    type: Number,
  },
  {
    collection: "TowiDb",
  }
);

mongoose.model("TowiDb", UserDetailSchema);
