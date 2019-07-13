export default (sequelize, DataTypes) => {
  class User extends sequelize.Model {
    static associate({ InsertionFinder, UserInsertionFinder}) {
      User.belongsToMany(InsertionFinder, {
        through: UserInsertionFinder,
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wcaId: {
      type: DataTypes.STRING(10),
      defaultValue: '',
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
    avatarThumb: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
  }, {
    sequelize,
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
    ]
  })
  return User
}
