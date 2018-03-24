var passport = require('passport');

module.exports = {
    IsAuthenticated: function (req,res,next){
        if(req.isAuthenticated()){
            next();
        }else{
            req.flash('warning', 'Please login to use this functionalities.');
            res.redirect('/login');
        }
    }
};