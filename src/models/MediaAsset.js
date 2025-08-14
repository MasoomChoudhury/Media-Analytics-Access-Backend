const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const AdminUser = require('./AdminUser');

class MediaAsset extends Model {}

MediaAsset.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['video', 'audio']],
      },
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.BIGINT,
    },
    duration: {
      type: DataTypes.INTEGER, // in seconds
    },
    mime_type: {
      type: DataTypes.STRING,
    },
    uploaded_by: {
      type: DataTypes.UUID,
      references: {
        model: AdminUser,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'MediaAsset',
    tableName: 'media_assets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

AdminUser.hasMany(MediaAsset, { foreignKey: 'uploaded_by' });
MediaAsset.belongsTo(AdminUser, { foreignKey: 'uploaded_by' });

module.exports = MediaAsset;
