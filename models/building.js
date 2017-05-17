module.exports = function(sequelize, DataTypes) {
  var Building = sequelize.define("Building", {
    Address: DataTypes.STRING
  },
    {
      classMethods: {
        associate: function(models) {
          Building.hasMany(models.Review, {
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return Building;
};
