var path = require('path');
// Routes
// =============================================================
module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Test' });
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

}
