module.exports = function(sequelize, DataTypes) {
  var Reviews = sequelize.define("Review", {
    scores: DataTypes.STRING,
    comment: DataTypes.TEXT
  },
    {
      classMethods: {
        associate: function(models) {
          Reviews.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
          Reviews.belongsTo(models.Building, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );
  return Reviews;
};
