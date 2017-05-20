module.exports = function(sequelize, DataTypes) {
  var Building = sequelize.define("Building", {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    ratings: DataTypes.STRING,
    googleMaps_id: DataTypes.STRING
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
