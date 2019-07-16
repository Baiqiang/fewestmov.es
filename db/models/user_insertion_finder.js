export default (sequelize, DataTypes) => {
  class UserInsertionFinder extends sequelize.Model {
    async getInfo() {
      const insertionFinder = await this.getInsertionFinder()
      const realIF = await insertionFinder.getRealInsertionFinder()
      return {
        hash: insertionFinder.hash,
        name: this.name,
        scramble: realIF.scramble,
        status: realIF.status,
        createdAt: this.createdAt,
      }
    }
    static associate({ InsertionFinder, User}) {
      UserInsertionFinder.belongsTo(User)
      UserInsertionFinder.belongsTo(InsertionFinder)
    }
  }
  UserInsertionFinder.init({
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
  }, {
    sequelize,
    paranoid: true
  })
  return UserInsertionFinder
}
