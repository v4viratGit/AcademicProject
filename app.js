//PACKAGE CONFIGURATIONS

    //EXPRESS
const express       =       require("express"),
      app           =       express();
      app.use(express.urlencoded({extended:true}));

    //EJS
        ejs           =       require("ejs");
        app.set('view engine', 'ejs');

    //STATIC FILES CONFIGURATION
        app.use(express.static(__dirname + '/public'));

    //MONGOOSE-MONGODB
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/RPServices', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
    mongoose.set('useCreateIndex', true);
    const User=require("./models/user");

    //METHOD-OVERRIDE
    const methodOverride = require('method-override');
    app.use(methodOverride('_method'));

    //EXPRESS SESSION
    const expressSession= require("express-session");
    app.use(expressSession({
        secret: "RPServices session secret",
        resave: false,
        saveUninitialized: false
    }));
    
    //PASSPORT
    const
    passport      = require("passport"),
    passportLocal = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new passportLocal(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //MIDDLEWARE
    middleware = require("./middleware/middleware");
//----------------------------------------------------------------------//



//ROUTES
    //HOME ROUTE
    app.get("/", (req,res)=>{
        res.render("home");
    });

    //----------------------//
    //CRUD FOR USER
    //CREATE NEW USER
    //USER SIGNUP
    //USER SIGNUP FORM GET ROUTE
    app.get("/user/new", (req,res)=>{
        res.render("signup-form");
    });

    //USER SIGNUP POST ROUTE
    app.post("/user", (req,res)=>{
        const newUser={
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        };
        User.register(new User(newUser), req.body.password, (err, registeredUser)=>{
            if(err){
                console.log(err);
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/login");
            });
        });  
    });

    //USER LOGIN
    //LOGIN FORM GET ROUTE
    app.get("/user/login", (req,res)=>{
        res.render("login-form");
    });
    //LOGIN FORM HANDLER POST ROUTE
    app.post("/user/login", passport.authenticate('local', { failureRedirect: '/login',
    failureFlash: true }),(req,res)=>{
        res.redirect("/");
    });


    //ORDER MAID ROUTE
    app.get("/order", middleware.isLoggedIn, (req,res)=>{
        res.render("order-form");
    });

    //LOGIN FORM ROUTE
    app.get("/login", (req,res)=>{
        res.render("login-form");
    });

    //SIGN UP FORM ROUTE
    app.get("/signup", (req,res)=>{
        res.render("signup-form");
    });

    //USER ACCOUNT DETAILS ROUTE
    app.get("/user", (req,res)=>{
        res.render("user-account");
    });

    //ADDING NEW STAFF ROUTE
    app.get("/newStaff", (req,res)=>{
        res.render("New-staff");
    });

    //ADMIN PAGE ROUTE
    app.get("/admin", (req,res)=>{
        res.render("admin");
    });


//PORT LISTENER
app.listen(3000, ()=>{
    console.log("Server started");
});
