//REQUIRED PACKAGES ADDED
const mongoose = require('mongoose');


//CREATE MongoDB SCHEMA FOR prices COLLECTION
const priceSchema = new mongoose.Schema({
    serviceType: String,
    serviceCharge: Number,
    partTimeCharge: Number,
    fullTimeCharge: Number,
    materialCharge: Number,
});

//MONGODB MODEL Price FOR PriceSchema
const Price= mongoose.model('Price', priceSchema);

//EXPORT MONGOOSE MODEL
module.exports=Price;