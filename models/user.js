module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fb_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Review, {
          onDelete: "cascade"
        });
      }
    }
  });
  return User;
};
