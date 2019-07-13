export default (sequelize, DataTypes) => {
  class RealInsertionFinder extends sequelize.Model {
    static associate({ InsertionFinder, Alg}) {
      RealInsertionFinder.hasMany(Alg)
      RealInsertionFinder.hasMany(InsertionFinder)
    }
  }
  RealInsertionFinder.init({
    hash: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    scramble: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skeleton: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
      allowNull: false,
    },
    totalCycles: {
      type:DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
    cornerCycles: {
      type:DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
    edgeCycles: {
      type:DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
    centerCycles: {
      type:DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
    parity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    cycleDetail: {
      type: DataTypes.JSON,
      defaultValue: '',
      allowNull: false,
    },
    result: {
      type: DataTypes.JSON,
      defaultValue: '',
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    sequelize,
    indexes: [
      {
        fields: ['hash'],
      },
      {
        fields: ['status'],
      }
    ]
  })
  RealInsertionFinder.STATUS = {
    WAITING: 0,
    COMPUTING: 1,
    FINISHED: 2
  }
  return RealInsertionFinder
}
