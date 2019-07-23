export default (sequelize, DataTypes) => {
  class User extends sequelize.Model {
    async hasRole(name) {
      if (!this.roles) {
        this.roles = await this.getUserRoles()
      }
      return this.roles.find(role => role.name === name) !== undefined
    }
    async getAdminInfo() {
      const info = this.dataValues
      const insertions = await this.sequelize.models.UserInsertionFinder.count({
        where: {
          user_id: this.id
        }
      })
      info.insertions = insertions
      return info
    }
    static associate({ InsertionFinder, UserInsertionFinder, UserRole}) {
      User.belongsToMany(InsertionFinder, {
        through: UserInsertionFinder,
      })
      User.hasMany(UserInsertionFinder)
      User.hasMany(UserRole)
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
