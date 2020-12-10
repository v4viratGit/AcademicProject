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
    //Home route
      app.get("/", (req,res)=>{
        res.render("home");
    });
    
    //Home route
    app.get("/frequency", (req,res)=>{
        res.render("frequency");
    });


//PORT LISTENER
app.listen(3000, ()=>{
    console.log("Server started");
});
