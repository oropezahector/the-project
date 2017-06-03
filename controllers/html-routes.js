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

  app.get('/:id?', function(req, res) {
    var id = req.params.id;
    models.User.findOne({
      where: {
        fb_id: id
      }
    }).then(function(user) {
      if (user) {
        res.render('index', { user: user.name, id:user.fb_id });
      } else {
        res.redirect('/');
      }
    });
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook', {authType: 'reauthenticate', scope: ['email', 'user_friends'] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/errorlogin' }),
    function(req, res) {
      console.log(req.user);
      res.render('index', {
        user: req.user._json.name,
        id: req.user._json.id
      });
    });

  app.get('/errorlogin', function(req, res) {
    console.log('Error Logging in');
    res.redirect('/');
  });
}
