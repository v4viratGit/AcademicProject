//MIDDLEWARE OBJECT
const middlewareObj={};


//MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN OR NOT
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }    
    res.redirect("/login");
}


//EXPORT THE MIDDLEWARE OBJECT
module.exports=middlewareObj