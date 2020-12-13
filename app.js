//PACKAGE CONFIGURATIONS

    //EXPRESS
const express       =       require("express"),
      app           =       express(),

    //EJS
      ejs           =       require("ejs");
      app.set('view engine', 'ejs');

    //STATIC FILES CONFIGURATION
    app.use(express.static(__dirname + '/public'));


//ROUTES
    //HOME ROUTE
      app.get("/", (req,res)=>{
        res.render("home");
    });
    
    //ORDER MAID ROUTE
    app.get("/order", (req,res)=>{
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


//PORT LISTENER
app.listen(3000, ()=>{
    console.log("Server started");
});
