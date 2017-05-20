module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    fb_id: DataTypes.STRING
  },
  },
    {
      classMethods: {
        associate: function(models) {
          User.hasMany(models.Reivews, {
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return User;
};
