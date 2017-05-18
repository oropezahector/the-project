module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    fb_id: DataTypes.STRING
  });
  return User;
};
