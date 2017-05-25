module.exports = function(sequelize, DataTypes) {
  var Building = sequelize.define("Building", {
    place_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {

        Building.hasMany(models.Review, {
          onDelete: "cascade"
        });
      }
    }
  });
  return Building;
};
