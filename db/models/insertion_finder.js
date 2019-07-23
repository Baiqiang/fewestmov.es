export default (sequelize, DataTypes) => {
  class InsertionFinder extends sequelize.Model {
    async getInfo() {
      const realIF = await this.getRealInsertionFinder()
      const info = {
        hash: this.hash,
        scramble: realIF.scramble,
        skeleton: this.skeleton,
        algs: (await realIF.getAlgs()).map(alg => alg.name),
        totalCycles: realIF.totalCycles / 2,
        cornerCycles: realIF.cornerCycles,
        edgeCycles: realIF.edgeCycles,
        centerCycles: realIF.centerCycles,
        parity: realIF.parity,
        cycleDetail: realIF.cycleDetail,
        result: realIF.result,
        status: realIF.status,
        createdAt: this.createdAt
      }
      return info
    }
    async getAdminInfo() {
      const info = await this.getInfo()
      const userIFs = await this.getUserInsertionFinders()
      info.userIFs = await Promise.all(userIFs.map(userIF => userIF.getAdminInfo()))
      return info
    }
    static associate({ User, UserInsertionFinder, RealInsertionFinder }) {
      InsertionFinder.belongsToMany(User, {
        through: UserInsertionFinder,
      })
      InsertionFinder.belongsTo(RealInsertionFinder)
      InsertionFinder.hasMany(UserInsertionFinder)
    }
  }
  InsertionFinder.init({
    hash: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    skeleton: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
      allowNull: false,
    },
  }, {
    sequelize,
    indexes: [
      {
        fields: ['hash'],
      },
    ]
  })
  return InsertionFinder
}
