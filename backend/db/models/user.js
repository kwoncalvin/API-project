'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(
        models.Attendance,
        {as: 'Attendance', foreignKey: 'userId', onDelete: 'CASCADE',  hooks: true}
      );
      User.hasMany(
        models.Group,
        {foreignKey: 'organizerId', onDelete: 'CASCADE',  hooks: true}
      );
      User.hasMany(
        models.Membership,
        {as: 'Membership', foreignKey: 'userId', onDelete: 'CASCADE',  hooks: true}
      );
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Set'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Set'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
  });
  return User;
};
