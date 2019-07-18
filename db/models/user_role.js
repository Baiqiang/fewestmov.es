export default (sequelize, DataTypes) => {
  class UserRole extends sequelize.Model {
    static associate({ User }) {
      UserRole.belongsTo(User)
    }
  }
  UserRole.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    indexes: [
      {
        fields: ['name'],
        unique: true,
      },
    ]
  })
  Object.assign(UserRole, {
    ADMIN: 'admin'
  })
  return UserRole
}
