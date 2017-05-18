module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    userID: DataTypes.INTEGER,
    adressID: DataTypes.INTEGER,
    scores: DataTypes.STRING
  },
    {
      classMethods: {
        associate: function(models) {
          Review.hasOne(models.User, {
            onDelete: "cascade"
          });
          Review.hasOne(models.Building, {
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return Review;
};
