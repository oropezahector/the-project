'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var mysql = require('mysql');


var db = require('./models');

var app = express();


// Facebook Login
passport.use(new Strategy({
    clientID: 656771184520494,
    clientSecret: '28d78f0e3b9d3fe08cccd784fef463aa',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },function(accessToken, refreshToken, profile, cb) {
    checkUser(profile);
    return cb(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// app settings
app.set('port', (process.env.PORT || 3000))

app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());


var handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// routes
require("./controllers/html-routes.js")(app, passport);
require("./controllers/building-api-routes.js")(app);
require("./controllers/user-api-routes.js")(app);
require("./controllers/reviews-api-routes.js")(app);

function checkUser(profile){
  console.log(profile.id);
  
}

// connect to DB and start server
db.sequelize.sync().then(function() {
  app.listen(app.get('port'), function() {
    console.log("App listening on PORT " + app.get('port'));
  });
});

