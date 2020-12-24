//REQUIRE
const mongoose = require('mongoose');
passportLocalMongoose= require("passport-local-mongoose");
const Order= require("./order");


//MongoDB SCHEMA FOR USERS COLLECTION
const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    address: String,
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Order',
        },
    ]
});

//plugIn FOR PASSPORT LOCAL MONGOOSE
usersSchema.plugin(passportLocalMongoose);

//MONGOOSE MODEL FOR MONGODB COLLECTION 'users'
const User= mongoose.model('User', usersSchema);

//EXPORT MONGOOSE MODEL
module.exports=User;