var models = require('../models');
var user = require('../server.js');


module.exports = function(app) {

  app.get('/api/review', function(req, res) {
    models.Review.findAll({
      include: [{
        model: models.User
      },{
        model:models.Building
      }]
    }).then(function(reviews) {
      res.json(reviews);
    });
  });

  app.get('/api/review/:id', function(req, res) {
    models.Review.findOne({
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

  app.post('/api/review', function(req, res) {
    models.Review.create(req.body).then(function(reviews) {
      res.json(reviews);
    });
  });

  app.put('/api/review/:id', function(req, res){
    models.Review.update(
      req.body,{
        where: {
          id: req.params.id
        }
      }).then(function(reviews){
        res.json(reviews);
      });
  });
};
