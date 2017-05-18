'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = require('./models');

var app = express();


// app settings
app.set('port', (process.env.PORT || 3000))

app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

var handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


// routes
require("./controllers/html-routes.js")(app);
require("./controllers/building-api-routes.js")(app);
require("./controllers/user-api-routes.js")(app);
require("./controllers/reviews-api-routes.js")(app);

// connect to DB and start server
db.sequelize.sync().then(function() {
  app.listen(app.get('port'), function() {
    console.log("App listening on PORT " + app.get('port'));
  });
});