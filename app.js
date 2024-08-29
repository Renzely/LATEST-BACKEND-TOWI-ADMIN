const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./UserDetails");
// require("./AttendanceDetails");
// require("./ParcelDetails");
// require("./AttendanceInput");
// require("./ParcelInput");
require("./CoorDetails");
require("./InventoryData");
require("./RtvData");
require("./HistoryAttendance");
require("./status")
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()


app.use(express.json());

var cors = require("cors");
const { status, type, append } = require("express/lib/response");
app.use(cors());

const mongoURI =
  "mongodb+srv://TowiAppUser:TowiAppPass@towi.v2djp3n.mongodb.net/?retryWrites=true&w=majority&appName=TOWI";

const User = mongoose.model("TowiDb");

const Attendance = mongoose.model("TowiAttendances");

const BranchSKU = mongoose.model("BranchSKU");

// const Attendance = mongoose.model("attendances");

const Coordinator = mongoose.model("TowiCoordinator")

const RTV = mongoose.model("TowiReturnToVendor");

// const Parcel = mongoose.model("Towiinventory");

// const AttendanceInput = mongoose.model("attendanceInput");

// const ParcelInput = mongoose.model("parcelInput");

const ParcelData = mongoose.model("TowiInventory");

const JWT_SECRET = "asdfghjklzxcvbnmqwertyuiop";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Database Connected successfully");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send({ status: "started" });
});


app.post("/get-all-attendance", async (req, res) => {

const {userEmail} = req.body;

  try {
    User.aggregate([
      {
        $match: {
          "userEmail": userEmail
        }
      }, 
      

    ]).then((data) => {
      return res.send({ status: 200, data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }


});


app.post("/get-attendance", async (req, res) => {
  const { userEmail } = req.body;


  try {
    const attendanceData = await Attendance.find({ userEmail: userEmail }); // Fetch data from the database
    return res.send({ status: 200, data: attendanceData });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});



app.post('/save-branch-sku', async (req, res) => {
  try {
    const { accountNameBranchManning, category, skus } = req.body;

    console.log('Received data:', { accountNameBranchManning, category, skus });

    if (!accountNameBranchManning || !category || !skus || !Array.isArray(skus)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Upsert operation: If a document with the same branch and category exists, update it. Otherwise, create a new one.
    const result = await BranchSKU.updateOne(
      { accountNameBranchManning, category }, // Filter condition
      { $addToSet: { SKUs: { $each: skus } } }, // Add SKUs to the array, avoiding duplicates
      { upsert: true } // Create a new document if no matching document is found
    );

    console.log('Update result:', result);

    res.status(201).json({ message: 'BranchSKUs saved successfully', data: result });
  } catch (error) {
    console.error('Error saving BranchSKUs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






app.post("/register-user-admin", async(req, res) => {
  const {firstName, middleName, lastName, emailAddress, contactNum, password, roleAccount,accountNameBranchManning} = req.body;
  const encryptedPassword = await bcrypt.hash(password, 8);

  const oldUser = await User.findOne({emailAddress:emailAddress});

  const dateNow =  new Date();
  let type; 
  
  if (oldUser) return res.send({data:"User already exist!"});

  if (roleAccount === 'Coordinator'){
     type = 2 
  } else {
     type = 3
  }

  try {
      await User.create({
          roleAccount,
          accountNameBranchManning,
          firstName,
          middleName,
          lastName,
          emailAddress,
          contactNum,
          password: encryptedPassword,
          isActivate: false,
          j_date : dateNow,
          type : type
          
      });
      await Coordinator.create({
        coorEmailAdd: emailAddress,
        MerchandiserEmail: []
    });
      res.send({status: 200, data:"User Created"})
  } catch (error) {
      res.send({ status: "error", data: error});
  }
});





app.post("/get-admin-user", async(req, res)=> {
   

  try {

      const data = await User.aggregate([
          
             
        {
          $match: { $or: [{ type : { $eq: 2}}, {type : {$eq : 3}}]}
        },       

          {
              $project: {
                  "accountNameBranchManning" : 1,
                  "roleAccount" : 1,
                  "firstName" : 1,
                  "middleName" : 1,
                  "lastName" : 1,
                  "emailAddress" : 1,
                  "contactNum" : 1,
                  "isActivate" : 1,
                  // "j_date" : 1,
              }
          }
            
        
      ])
          
      return res.send({ status: 200, data: data});
  
  } catch (error) {
          return res.send({error: error});
  }

});

app.post("/login-admin", async (req, res) => {
  const { emailAddress, password } = req.body;
  const oldUser = await User.findOne({ emailAddress: emailAddress });

  if (!oldUser) return res.send({ status: 401, data: "Invalid email or password" });

  if (!oldUser.type === 2) return res.send({ status: 401, data: "Invalid User." });

  if (oldUser.isActivate === false) return res.send({ status: 401, data: "User is already deactivated." });

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ emailAddress: oldUser.emailAddress }, JWT_SECRET);

    if (res.status(201)) {
      return res.send({
        status: 200,
        data: {
          token,
          emailAddress: oldUser.emailAddress,
          firstName: oldUser.firstName,
          middleName: oldUser.middleName,
          lastName: oldUser.lastName,
          contactNum: oldUser.contactNum,
          roleAccount: oldUser.roleAccount // Include roleAccount in the response
        }
      });
    } else {
      return res.send({ error: "error" });
    }
  } else {
    return res.send({ status: 401, data: "Invalid user or password" });
  }
});


app.put("/update-status", async (req, res) => {
  const { isActivate, emailAddress } = req.body;

  const userEmail = emailAddress;
  console.log(userEmail);
  try {
    await User.findOneAndUpdate(
      { emailAddress: userEmail },
      { $set: { isActivate: isActivate } }
    );
    res.send({ status: 200, data: "Status updated" });
  } catch (error) {
    res.send({ status: "errorr", data: error });
  }
});

app.post("/user-data", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;

    User.findOne({ email: userEmail }).then((data) => {
      return res.send({ status: 200, data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.put("/update-user-branch", async (req, res) => {
  const { emailAddress, branches } = req.body;

  try {
    // Update the user's branches based on the provided email
    await mongoose
      .model("TowiDb")
      .findOneAndUpdate(
        { emailAddress: emailAddress },
        { $set: { accountNameBranchManning: branches } }
      );

    res
      .status(200)
      .send({ status: 200, message: "User branches updated successfully" });
  } catch (error) {
    res.status(500).send({ status: 500, error: error.message });
  }
});


app.post('/update-coor-details', async (req, res) => {
  try {
    const { emails, coorEmailAdd } = req.body;

    // Validate input
    if (!Array.isArray(emails) || emails.some(email => typeof email !== 'string')) {
      return res.status(400).send({ status: 400, message: "Invalid emails format" });
    }

    if (typeof coorEmailAdd !== 'string') {
      return res.status(400).send({ status: 400, message: "Invalid coordinator email format" });
    }

    // Find the existing CoorDetails document using the filter
    const coorDetails = await CoorDetails.findOne({ coorEmailAdd });

    if (!coorDetails) {
      return res.status(404).send({ status: 404, message: "CoorDetails document not found" });
    }

    // Update the document with the new emails
    coorDetails.merchandiserHandle = emails.map(email => ({ MerchandiserEmail: email }));

    await coorDetails.save();

    return res.send({ status: 200, message: "CoorDetails updated successfully" });
  } catch (error) {
    console.error("Error in /update-coor-details:", error);
    return res.status(500).send({ status: 500, message: error.message });
  }
});


app.post("/get-all-merchandiser", async (req, res) => {
  try {
    User.aggregate([
      {
        $match: {
          "type": 1
        }
      }, 
      
      {
        $project: {
            "firstName" : 1,
            "middleName" : 1,
            "lastName" : 1,
            "emailAddress" : 1,
            "contactNum" : 1,
            "isActivate" : 1,
            "remarks" : 1,
            "accountNameBranchManning" : 1,
            // "j_date" : 1,
        }
    }
    ]).then((data) => {
      return res.send({ status: 200, data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }


});



app.post("/get-all-user", async (req, res) => {
  try {
    User.aggregate([
      {
        $match: {
          "type": 1
        }
      }, 
      
      {
        $project: {
            "firstName" : 1,
            "middleName" : 1,
            "lastName" : 1,
            "emailAddress" : 1,
            "contactNum" : 1,
            "isActivate" : 1,
            "remarks" : 1,
            "accountNameBranchManning" : 1,
            // "j_date" : 1,
        }
    }
    ]).then((data) => {
      return res.send({ status: 200, data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }


});

app.post("/view-user-attendance", async (req, res) => {
  const { user } = req.body;

  const userEmail = user;

  try {
    console.log(userEmail, "user check");
    await Attendance.findOne({ user: userEmail }).then((data) => {
      return res.send({ status: 200, data: data.attendance });
    });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.post("/test-index", async (req, res) => {
  const { user } = req.body;

  const userEmail = user;

  try {
    console.log(userEmail, "user check");
    await Parcel.find()
      .count()
      .then((data) => {
        return res.send({ status: 200, data: data });
      });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.post("/retrieve-parcel-data", async (req, res) => {

  try {
    const parcelPerUser = await ParcelData.find();

    console.log("Found parcels:", parcelPerUser);
    return res.status(200).json({ status: 200, data: parcelPerUser });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.post("/filter-date", async (req, res) => {

  const {selectDate} = req.body;
  console.log("test" , selectDate)
  try {
    const parcelPerUser = await ParcelData.find( {date:{$eq:selectDate}} );

    console.log("Found parcels:", parcelPerUser);
    return res.status(200).json({ status: 200, data: parcelPerUser });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.post("/retrieve-RTV-data", async (req, res) => {
  try {
    const parcelPerUser = await RTV.find();

    console.log("Found parcels:", parcelPerUser);
    return res.status(200).json({ status: 200, data: parcelPerUser });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.post("/filter-RTV-data", async (req, res) => {
  
  const {selectDate} = req.body;
  try {
    const parcelPerUser = await RTV.find({date:{$eq:selectDate}});

    console.log("Found parcels:", parcelPerUser);
    return res.status(200).json({ status: 200, data: parcelPerUser });
  } catch (error) {
    return res.send({ error: error });
  }
});

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.Email,
    pass: process.env.Pass,
  },
});


app.post("/send-otp-register", async (req, res) => {
  const { email } = req.body;

  try {
    var code = Math.floor(100000 + Math.random() * 900000);   
    code = String(code);
    code = code.substring(0, 4);

    const info = await transporter.sendMail({
      from: {
        name: "BMPower",
        address: process.env.email,
      },
      to: email,
      subject: "OTP code",
      html: "<b>Your OTP code is</b> " + code + "<b>. Do not share this code with others.</b>",
    });

    return res.send({ status: 200, code: code });
  } catch (error) {
    return res.send({ error: error.message });
  }
});


app.put("/forgot-password-reset", async(req, res) => {
  const {password, emailAddress} = req.body;

  const encryptedPassword = await bcrypt.hash(password, 8);

  const userEmail = emailAddress;
  console.log(userEmail);
  try{
      await User.findOneAndUpdate({emailAddress: userEmail}, {$set: {password: encryptedPassword}});
      res.send({status: 200, data:"Password updated"})
  } catch(error){
      res.send({status: "error", data: error});
  }

});

app.post("/send-otp-forgotpassword", async (req, res) => {
  const { emailAddress } = req.body;

  const oldUser = await User.findOne({ emailAddress: emailAddress });

  if (!oldUser) {
    return res.status(404).json({ error: "Email does not exist" });
  }

  try {
    var code = Math.floor(100000 + Math.random() * 900000);
    code = String(code);
    code = code.substring(0, 4);

    const info = await transporter.sendMail({
      from: {
        name: "BMPower",
        address: process.env.Email,
      },
      to: emailAddress,
      subject: "OTP code",
      html:
        "<b>Your OTP code is</b> " +
        code +
        "<b>. Do not share this code with others.</b>",
    });
    
    return res.status(200).json({ status: 200, data: info, emailAddress: emailAddress, code: code });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});


app.listen(8080, () => {
  console.log("node js server started");
});
