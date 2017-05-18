module.exports = function(sequelize, DataTypes) {
  var Building = sequelize.define("Building", {
    Address: DataTypes.STRING
  });
  return Building;
};
