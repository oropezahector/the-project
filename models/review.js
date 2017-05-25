module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    scores: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Review.belongsTo(models.User, {
          foreignKey: {
            allowNull: false,
          }
        });
        Review.belongsTo(models.Building, {
          foreignKey: {
            allowNull: false,
          }
        });
      }
    }
  });
  return Review;
};
