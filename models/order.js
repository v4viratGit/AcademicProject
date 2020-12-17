//REQUIRED PACKAGES ADDED
const mongoose = require('mongoose');


//CREATE MongoDB SCHEMA FOR ORDERS COLLECTION
const orderSchema = new mongoose.Schema({
    name: String,
    frequency: String,
    jobType: String,
    professionals: Number,
    material: String,
    staff: [String],
    datetime: String,
    address: String,
    mobile: Number
});

//MONGODB MODEL Order FOR orderSchema
const Order= mongoose.model('Order', orderSchema);

//EXPORT MONGOOSE MODEL
module.exports=Order;