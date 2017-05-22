var path = require('path');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Login' });
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/errorlogin' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
      res.json(req.user);
    });

  app.get('/errorlogin', function(req, res){
    console.log('Error Logging in');
  });
}
