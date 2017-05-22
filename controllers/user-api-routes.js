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
        id: req.params.id
      },
      include: [{
        model: models.Review
      }]
    }).then(function(users) {
      res.json(users);
    });
  });

  app.post('/api/user', function(req, res) {
    models.User.create(req.body).then(function(users) {
      res.json(users);
    });
  });
};
