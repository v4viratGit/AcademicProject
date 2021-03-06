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
          Staff = require("./models/staff"),
          Price = require("./models/price");

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
                req.flash("error", "Something went wrong!");
                res.redirect("/");
                console.log(err);
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to RPServices, "+registeredUser.name+"!");
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
    failureFlash: 'Invalid username or password!' }),(req,res)=>{
        req.flash("success", "Welcome back!");      
        res.redirect("/");
    });

    //USER LOGOUT
    app.get("/user/logout",middleware.isLoggedIn, function (req,res) {
        req.logout(); 
        req.flash("success", "Logged out!");
        res.redirect("/");
     });

     //FIND, READ, AND SHOW USER
     app.get("/user/:id",middleware.isLoggedIn, (req,res)=>{
        User.findById(req.params.id,(err, foundUser)=>{
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/");
            console.log(err);
          } else {
            res.render("user-account", {foundUser});
          }
        });
      });

      //EDIT AND UPDATE USER INFORMATION
      //EDIT USER GET ROUTE
      app.get("/user/:id/edit",middleware.isLoggedIn, (req,res)=>{
        const id=req.params.id;
        User.findById(id, (err,foundUser)=>{
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/");
            console.log(err);
          } else {
            res.render("edit-profile", {foundUser});
          }
        });
      });
  //UPDATE USER PUT ROUTE
      app.put("/user/:id",middleware.isLoggedIn,(req,res)=>{
        const editedUser={
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        };
        User.findByIdAndUpdate(req.params.id, editedUser, (err, updatedUser)=>{
            if (err) {
              req.flash("error", "Something went wrong!");
              res.redirect("/");
              console.log(err);
            } else {
              req.flash("success", "Profile update successful!")
              res.redirect("/");
            }
          });
      });

      //DELETE USER DELETE ROUTE
      app.delete("/user/:id",middleware.isLoggedIn, (req,res)=>{
        User.findByIdAndDelete(req.params.id,(err)=>{
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/");
            console.log(err);
          } else {
            req.flash("success", "Successfully deleted user!");
            res.redirect("/")
          }
        }
        );
      });

    //--------------------------------------------//

    //----------------------------//
    const adminID="607fea4011cbc31f90a5f65d";
    //ADMIN ROUTES
    //ADMIN DASHBOARD
    //ROUTE TO SHOW ALL ORDERS TO THE ADMIN
    app.get("/admin/orders", (req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        },(req,res)=>{
        Order.find({}, function(err, allOrders){
            if(err){
                req.flash("error", "Something went wrong!");
                res.redirect("/");
                console.log(err);
            } else {
                res.render("show-orders", {allOrders});
            }
        });
    });

    //STAFF CRUD
    //CREATE NEW STAFF GET ROUTE
    app.get("/admin/staff/new", (req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        }, 
        (req,res)=>{
        res.render("new-staff");
    });

    //CREATE NEW STAFF POST ROUTE
    app.post("/admin/staff", (req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        },
        (req,res)=>{
        const newStaff=req.body;
        Staff.create(newStaff, (err, newStaff)=>{
        if (err) {
          req.flash("error", "Something went wrong!");
          res.redirect("/");
          console.log(err);
        } else {
          req.flash("success", "Successfully added!");
          res.redirect("/");
        }
        }
        ); 
      });

      //READ AND SHOW STAFF
      //LIST OF ALL STAFF MEMBERS
      app.get("/admin/staff/show",(req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        }, 
        (req,res)=>{
        Staff.find({}, function(err, allStaff){
            if(err){
              req.flash("error", "Something went wrong!");
              res.redirect("/");
              console.log(err);
            } else {
                res.render("staff-list", {allStaff});
            }
        });
    });
    //SHOW INFORMATION OF AN INDIVIDUAL STAFF MEMBER
    app.get("/admin/staff/:id", (req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        },
        (req,res)=>{
        Staff.findById(req.params.id,(err, foundStaff)=>{
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/");
            console.log(err);
          } else {
            res.render("show-staff", {foundStaff});
          }
        });
      });

      //UPDATE - EDIT AND UPDATE STAFF
      //EDIT STAFF GET ROUTE
      app.get("/admin/staff/:id/edit", (req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        },
        (req,res)=>{
        Staff.findById(req.params.id, (err,foundStaff)=>{
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/");
            console.log(err);
          } else {
            res.render("edit-staff", {foundStaff});
          }
        });
      });
  //UPDATE STAFF PUT ROUTE
      app.put("/admin/staff/:id",(req,res,next)=>{
        if(req.isAuthenticated()&&req.user._id==adminID){
            return next();
        }    
        res.redirect("/login");
        },
        (req,res)=>{
        const editedStaff=req.body;
        Staff.findByIdAndUpdate(req.params.id, editedStaff, (err, updatedStaff)=>{
            if (err) {
              req.flash("error", "Something went wrong!");
              res.redirect("/");
              console.log(err);
            } else {
              req.flash("success", "Successfully updated information!")
              res.redirect("/");
            }
          });
      });

  //DESTROY STAFF
  app.delete("/admin/staff/:id", (req,res,next)=>{
    if(req.isAuthenticated()&&req.user._id==adminID){
        return next();
    }    
    res.redirect("/login");
    },
    (req,res)=>{
    Staff.findByIdAndDelete(req.params.id,(err)=>{
      if (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("/");
        console.log(err);
      } else {
        req.flash("success", "Successfully deleted")
        res.redirect("/")
      }
    }
    );
  });


  //SERVICES ROUTES
  //SERVICE CHARGE/PRICE ROUTES
  
  //SHOW/INDEX ALL SERVICES AND THEIR PRICES
  app.get("/admin/service/show",(req,res,next)=>{
    if(req.isAuthenticated()&&req.user._id==adminID){
        return next();
    }    
    res.redirect("/login");
    }, 
    (req,res)=>{
    Price.find({}, function(err, allServices){
        if(err){
          req.flash("error", "Something went wrong!");
          res.redirect("/");
          console.log(err);
        } else {
            res.render("service-list", {allServices});
        }
    });
});

  //SHOW AN INDIVIDUAL SERVICE ROUTE
  app.get("/admin/service/:id", (req,res,next)=>{
    if(req.isAuthenticated()&&req.user._id==adminID){
        return next();
    }    
    res.redirect("/login");
    }, (req,res)=>{
    Price.findById(req.params.id, (err, foundService)=>{
      if (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("/");
        console.log(err);
      } else {
        res.render("show-service", {foundService}); 
      }
    });
  });

  //EDIT-UPDATE SERVICE CHARGES
  //EDIT SERVICES CHARGES GET ROUTE
  app.get("/admin/service/:id/edit", (req,res,next)=>{
    if(req.isAuthenticated()&&req.user._id==adminID){
        return next();
    }    
    res.redirect("/login");
    },
    (req,res)=>{
    Price.findById(req.params.id, (err,foundService)=>{
      if (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("/");
        console.log(err);
      } else {
        res.render("edit-service", {foundService});
      }
    });
  });

//UPDATE SERVICE PUT ROUTE
  app.put("/admin/service/:id",(req,res,next)=>{
    if(req.isAuthenticated()&&req.user._id==adminID){
        return next();
    }    
    res.redirect("/login");
    },
    (req,res)=>{
    const editedService=req.body;
    Price.findByIdAndUpdate(req.params.id, editedService, (err, updatedService)=>{
        if (err) {
          req.flash("error", "Something went wrong!");
          res.redirect("/");
          console.log(err);
        } else {
          req.flash("success", "Successfully updated information!")
          res.redirect("/");
        }
      });
  });
  
  //----------------------------------------------------------//

  //----------------------------------------------------------//
    //ORDER ROUTES
    //PLACE ORDER GET ROUTE
    app.get("/user/:id/order/new",middleware.isLoggedIn,(req,res)=>{
        Staff.find({}, function(err, allstaff){
            if(err){
              req.flash("error", "Something went wrong!");
              res.redirect("/");
              console.log(err);
            } else {
                res.render("order-form", {allstaff});
            }
        });
    });

    //STORE ORDER POST ROUTE  //CONFIRM ORDER PAGE ROUTE
    app.post("/user/:id/order", middleware.isLoggedIn,(req,res)=>{
      const id=req.params.id;
      const newOrder=req.body;
      User.findById(id,(err,foundUser)=>{
        if (err) {
          console.log(err);
        } else {
          Order.create(newOrder, (err, newOrder)=>{
            if (err) {
              req.flash("error", "Something went wrong!");
              res.redirect("/");
              console.log(err);
            } else {   
                  newOrder.save();             
                  foundUser.orders.push(newOrder);
                  foundUser.save();     
                } 
            });
      }});
      Price.findOne({ 'serviceType': req.body.jobCategory }, (err, foundService)=>{
        if (err) {
          req.flash("error", "Something went wrong!");
          res.redirect("/");
          console.log(err);
        } else {
          res.render("order-summary",{newOrder, foundService});  
        }
      })
    }); 

    //MAKE PAYMENT ROUTE
    app.get("/user/order/:total/payment",middleware.isLoggedIn, (req,res)=>{
      const Total=req.params.total;
      res.render("payments", {Total})
    })

  //SHOW USER'S ORDERS
    app.get("/user/:id/order", middleware.isLoggedIn,(req,res)=>{
      User.findById(req.params.id).populate('orders').exec((err,foundUser)=>{
        if (err) {
          req.flash("error", "Something went wrong!");
          res.redirect("/");
          console.log(err);
        } else {
          res.render("show-user-orders", {foundUser});
        }
      });
    });

  //--------------------------------------------------------//

  //PAGE NOTFOUND ROUTE/DEFAULT ROUTE
  app.get("*", (req,res)=>{
    res.render("pagenotfound");
  });

//PORT LISTENER
app.listen(3000, ()=>{
    console.log("Server started");
});
