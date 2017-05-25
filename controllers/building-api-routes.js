var models = require('../models');

module.exports = function(app) {

  app.get('/api/building', function(req, res) {
    models.Building.findAll({
      include: [{
        model: models.Review
      }]
    }).then(function(building) {
      res.json(building);
    });
  });

  app.get('/api/building/:id', function(req, res) {
    models.Building.findOne({
      where: {
        place_id: req.params.id
      },
      include: [{
        model: models.Review
      }]
    }).then(function(building) {
      res.json(building);
    });
  });

  app.post('/api/building', function(req, res) {
    models.Building.create(req.body).then(function(building) {
      res.json(building);
    });
  });
};
