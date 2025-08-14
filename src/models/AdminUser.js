const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

class AdminUser extends Model {
  // Method to compare passwords
  async comparePassword(password) {
    return bcrypt.compare(password, this.hashed_password);
  }
}

AdminUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'AdminUser',
    tableName: 'admin_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.hashed_password) {
          const salt = await bcrypt.genSalt(10);
          user.hashed_password = await bcrypt.hash(user.hashed_password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('hashed_password')) {
          const salt = await bcrypt.genSalt(10);
          user.hashed_password = await bcrypt.hash(user.hashed_password, salt);
        }
      },
    },
  }
);

module.exports = AdminUser;
