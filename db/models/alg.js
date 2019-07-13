export default (sequelize, DataTypes) => {
  class Alg extends sequelize.Model {
    static associate({ RealInsertionFinder}) {
      Alg.belongsTo(RealInsertionFinder)
    }
  }
  Alg.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    indexes: [
      {
        fields: ['name'],
      },
    ]
  })
  return Alg
}
