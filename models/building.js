module.exports = function(sequelize, DataTypes) {
  var Building = sequelize.define("Building", {
    Address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Ratings: {
      type: DataTypes.INTEGER,
      get: function(){
        return this.getDataValue('Ratings').split(";")
      },
      set: function(val){
        this.setDataValue('Ratings', val.join(";"));
      }
    }
  },
    {
      classMethods: {
        associate: function(models) {

          Building.hasMany(models.Reviews, {
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return Building;
};
