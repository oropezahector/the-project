var path = require('path');
var models = require('../models');

module.exports = function(app, passport) {

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/', function(req, res) {
    res.render('index', { title: 'Test' });
  });

  app.get('/:id/:name', function(req, res) {
    var id = req.params.id;
    var name = req.params.name;
    res.render('index', { user: name, id:id });
    });
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook', {authType: 'reauthenticate', scope: ['email', 'user_friends'] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/errorlogin' }),
    function(req, res) {
      console.log(req.user);
      res.redirect('/'+ req.user.id + '/'+ req.user._json.name)
    });

  app.get('/errorlogin', function(req, res) {
    console.log('Error Logging in');
    res.redirect('/');
  });
}
