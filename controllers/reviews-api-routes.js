var models = require('../models');

module.exports = function(app) {

  app.get('/api/reviews', function(req, res) {
    models.Reviews.findAll({
      include: [{
        model: models.User
      }]
    }).then(function(reviews) {
      res.json(reviews);
    });
  });

  app.get('/api/reviews/:id', function(req, res) {
    models.Reviews.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: models.User
      }]
    }).then(function(reviews) {
      res.json(reviews);
    });
  });

  app.post('/api/reviews', function(req, res) {
    db.Review.create(req.body).then(function(reviews) {
      res.json(reviews);
    });
  });

  app.put('/api/reviews/:id', function(req, res){
    db.Review.update(
      req.body,{
        where: {
          id: req.params.id
        }
      }).then(function(reviews){
        res.json(reviews);
      });
  });
};
