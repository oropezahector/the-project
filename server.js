'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var mysql = require('mysql');


var db = require('./models');

var app = express();

var loggedInUser;

// Facebook Login
passport.use(new Strategy({
  clientID: 656771184520494,
  clientSecret: '28d78f0e3b9d3fe08cccd784fef463aa',
  callbackURL: 'https://poopy-places.herokuapp.com/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, function(accessToken, refreshToken, profile, cb) {
  checkUser(profile);
  loggedInUser = profile._json;
  return cb(null, profile);
}));


passport.serializeUser(function(user, cb) {
  // console.log("Serialize", user);
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
require("./controllers/html-routes.js")(app, passport, loggedInUser);
require("./controllers/building-api-routes.js")(app);
require("./controllers/user-api-routes.js")(app);
require("./controllers/reviews-api-routes.js")(app);

// checks user
function checkUser(profile) {
  // console.log(profile._json);
  // console.log('ID: ' + profile._json.id + ' name: ' + profile._json.name);
  db.User.findOne(profile._json, {
    where: {
      fb_id: profile.id
    }
  }).then(function(user) {
    if (!user){
      db.User.create({
        name: profile._json.name,
        fb_id: profile._json.id,
        email: profile._json.email
      }).then(function(user){
        console.log('New User Created');
      });
    }
    console.log('USER: ' + loggedInUser.name);
  });
}

// connect to DB and start server
db.sequelize.sync().then(function() {
  app.listen(app.get('port'), function() {
    console.log("App listening on PORT " + app.get('port'));
  });
});
