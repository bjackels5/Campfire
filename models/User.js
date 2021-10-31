const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

const bcrypt = require('bcrypt');

class User extends Model {
  checkPassword(loginPw) {
    //This checks the hashed pw with the actual pw
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: 4
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    img_url: {
      type: DataTypes.STRING,
      defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      validate: {
      isURL: true
      }
    }
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        console.log(updatedUserData);
        if (updatedUserData._previousDataValues.password !== updatedUserData.dataValues.password) {
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
          return updatedUserData;
        }
      }
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;