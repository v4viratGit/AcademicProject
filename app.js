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
    

    //All MODEL ROUTES
    const User  = require("./models/user"),
          Order = require("./models/order"),
          Staff = require("./models/staff");

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

    //RES.LOCALS AND FLASH
    const flash         = require("connect-flash");
    app.use(flash());
    app.use((req,res,next)=> {
        res.locals.currentUser=req.user;
        res.locals.errorFlash=req.flash("error");
        res.locals.successFlash=req.flash("success");
        next(); 
     });
//----------------------------------------------------------------------//



//ROUTES
    //HOME ROUTE
    app.get("/", (req,res)=>{
        res.render("home");
    });

    //----------------------//
    //CRUD FOR USER

    //CREATE NEW USER
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
                res.redirect("/");
            });
        });  
    });

    //USER LOGIN
    //LOGIN FORM GET ROUTE
    app.get("/user/login", (req,res)=>{
        res.render("login-form");
    });
    //LOGIN FORM HANDLER POST ROUTE
    app.post("/user/login", passport.authenticate('local', { failureRedirect: '/',
    failureFlash: true }),(req,res)=>{
        res.redirect("/");
    });

    //USER LOGOUT
    app.get("/user/logout", function (req,res) {
        req.logout(); 
        res.redirect("/");
     });

     //FIND, READ, AND SHOW USER
     app.get("/user/:id", (req,res)=>{
        User.findById(req.params.id,(err, foundUser)=>{
          if (err) {
            console.log(err);
          } else {
            res.render("user-account", {foundUser});
          }
        });
      });

      //EDIT AND UPDATE USER INFORMATION
      //EDIT USER GET ROUTE
      app.get("/user/:id/edit", (req,res)=>{
        const id=req.params.id;
        User.findById(id, (err,foundUser)=>{
          if (err) {
            console.log(err);
          } else {
            res.render("edit-profile", {foundUser});
          }
        });
      });
  //UPDATE USER PUT ROUTE
      app.put("/user/:id",(req,res)=>{
        const editedUser={
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        };
        User.findByIdAndUpdate(req.params.id, editedUser, (err, updatedUser)=>{
            if (err) {
              console.log(err);
            } else {
              res.redirect("/");
            }
          });
      });

      //DELETE USER DELETE ROUTE
      app.delete("/user/:id", (req,res)=>{
        User.findByIdAndDelete(req.params.id,(err)=>{
          if (err) {
            console.log(err);
          } else {
            res.redirect("/")
          }
        }
        );
      });

    //--------------------------------------------//

    //----------------------------//
    //ADMIN ROUTES
    //ADMIN DASHBOARD
    //ROUTE TO SHOW ALL ORDERS TO THE ADMIN
    app.get("/admin/orders", (req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id=="5fddfb41e8e4af22f064ede8"){
            return next();
        }    
        res.redirect("/login");
        },(req,res)=>{
        Order.find({}, function(err, allOrders){
            if(err){
                console.log(err);
            } else {
                res.render("admin", {allorders: allOrders});
            }
        });
    });


    //ORDER ROUTE
    app.get("/order", middleware.isLoggedIn, (req,res)=>{
        Staff.find({}, function(err, allStaff){
            if(err){
                console.log(err);
            } else {
                res.render("order-form", {allstaff: allStaff});
            }
        });
        //res.render("order-form");
    });

    //STORE ORDER POST ROUTE
    app.post("/orders", (req,res)=>{
        var orderData = new Order(req.body);
        orderData.save()
        .then(orderItem => {
            console.log("Order saved to Database");
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
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

    //ADDING NEW STAFF GET ROUTE
    app.get("/admin/newStaff", (req,res)=>{
        res.render("New-staff");
    });

    //ADDING NEW STAFF POST ROUTE
    app.post("/admin/newStaff", (req,res)=>{
        var staffData = new Staff(req.body);
        staffData.save()
        .then(data => {
            console.log("New Staff Added Successfully");
            res.redirect("/admin");
        })
        .catch(err => {
            console.log(err);
        });
    }); 
    
    //ROUTE TO SHOW ALL STAFF
    app.get("/staff", (req,res)=>{
        Staff.find({}, function(err, allStaff){
            if(err){
                console.log(err);
            } else {
                res.render("show-staff", {allstaff: allStaff});
            }
        });
    });

 


//PORT LISTENER
app.listen(3000, ()=>{
    console.log("Server started");
});
