//REQUIRED PACKAGES ADDED
const mongoose = require('mongoose');


//CREATE MongoDB SCHEMA FOR STAFF COLLECTION
const staffSchema = new mongoose.Schema({
    name: String,
    gender: String,
    address: String,
    mobile: Number,
    skills: String,
    description: String
});

//MONGODB MODEL Order FOR orderSchema
const Staff= mongoose.model('Staff', staffSchema);

//EXPORT MONGOOSE MODEL
module.exports=Staff;