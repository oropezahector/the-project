var models = require('../models');

module.exports = function(app) {

  app.get('/api/user', function(req, res) {
    models.User.findAll({}).then(function(users) {
      res.json(users);
    });
  });

  app.get('/api/user/:id', function(req, res) {
    models.User.findOne({
      where: {
        fb_id: req.params.id
      },
      include: [{
        model: models.Review
      }]
    }).then(function(user) {
      res.render('index', user);
    });
  });

  app.post('/api/user', function(req, res) {
    models.User.create(req.body).then(function(users) {
      res.json(users);
    });
  });

  app.put('/api/user', function(req, res) {
    models.User.update(
      req.body, {
        where: {
          fb_id: req.body.fb_id
        }
      }).then(function(users) {
      res.json(users);
    })
  })
};
