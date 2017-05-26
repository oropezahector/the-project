var path = require('path');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Poopy Places!' });
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'user_friends'] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/errorlogin' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/errorlogin', function(req, res) {
    console.log('Error Logging in');
    res.redirect('/');
  });
}
