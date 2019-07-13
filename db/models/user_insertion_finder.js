export default (sequelize, DataTypes) => {
  class UserInsertionFinder extends sequelize.Model {
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
