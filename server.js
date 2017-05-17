'use strict'
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");



var app = express();

app.set('port', (process.env.PORT || 3000))

app.use(express.static(process.cwd() + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/building_controller.js");

app.use("/", routes);

app.listen(app.get('port'), function() {
	console.log('Server listening on port: ' + app.get('port'));
});
