const mongoose = require('mongoose');

const branchSKUSchema = new mongoose.Schema({
  accountNameBranchManning: { type: String, required: true },
  category: { type: String, required: true },
  SKUs: [{ 
    SKUDescription: { type: String }, 
    enabled: { type: Boolean, default: true },
    status: { type: String, default: 'Carried' }
  }]
});

const BranchSKU = mongoose.model('BranchSKU', branchSKUSchema);

module.exports = BranchSKU;
