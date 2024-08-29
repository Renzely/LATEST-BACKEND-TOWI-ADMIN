const mongoose = require('mongoose');

const branchSKUSchema = new mongoose.Schema({
  accountNameBranchManning: { type: String, required: true },
  category: { type: String, required: true },
  SKUs: [{ 
    SKUDescription: { type: String }, 
    enabled: { type: Boolean, default: false } 
  }]
});

const BranchSKU = mongoose.model('BranchSKU', branchSKUSchema);

module.exports = BranchSKU;
