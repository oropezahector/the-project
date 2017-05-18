'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');



var app = express();

app.set('port', (process.env.PORT || 3000))

app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

var handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var routes = require('./controllers');

app.use('/', routes);

app.listen(app.get('port'), function() {
	console.log('Server listening on port: ' + app.get('port'));
});
