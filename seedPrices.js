//MONGOOSE-MONGODB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/RPServices', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
mongoose.set('useCreateIndex', true);

const Price  = require("./models/price");



//INSERTING DATA
const Services= [
    {
        serviceType: "Deep Cleaning",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Pest Control",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Sofa Cleaning",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Mattress Cleaning",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Car Wash",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "AC Cleaning",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Laundry and Dry Cleaning",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Handyman and Maintenance",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Bodyguard",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Event Security",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Bank Security",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
    {
        serviceType: "Residential Security",
        serviceCharge: 100,
        partTimeCharge: 70,
        materialCharge: 30,
    },
];

//SEEDING DB
Price.insertMany(Services);
