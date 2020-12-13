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

    //ADD NEW STAFF ROUTE
    app.get("/addNew", (req,res)=>{
        res.render("New-staff");
    });


//PORT LISTENER
app.listen(3000, ()=>{
    console.log("Server started");
});
