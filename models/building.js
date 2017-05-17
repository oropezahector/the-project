module.exports = function(sequelize, DataTypes) {
  var Building = sequelize.define("Building", {
    Address: DataTypes.STRING
  },
    {
      classMethods: {
        associate: function(models) {
<<<<<<< HEAD
          Building.hasMany(models.Review, {
=======
          // Associating Author with Posts
          // When an Author is deleted, also delete any associated Posts
          Building.hasMany(models.Post, {
>>>>>>> 4f3c3bc82dfe5d8cad0a9fa243f156134e3622ca
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return Building;
};
