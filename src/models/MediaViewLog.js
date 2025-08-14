const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const MediaAsset = require('./MediaAsset');

class MediaViewLog extends Model {}

MediaViewLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    media_id: {
      type: DataTypes.UUID,
      references: {
        model: MediaAsset,
        key: 'id',
      },
      allowNull: false,
    },
    viewed_by_ip: {
      type: DataTypes.STRING, // Using STRING for INET compatibility
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    stream_duration: {
      type: DataTypes.INTEGER, // seconds watched
    },
    view_session_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  {
    sequelize,
    modelName: 'MediaViewLog',
    tableName: 'media_view_logs',
    timestamps: true,
    createdAt: 'timestamp',
    updatedAt: false, // No 'updated_at' field for this model
    indexes: [
      { fields: ['media_id', 'timestamp'] },
      { fields: ['viewed_by_ip', 'timestamp'] },
      // { fields: ['media_id', sequelize.fn('DATE', sequelize.col('timestamp'))] },
      {
        unique: true,
        fields: ['media_id', 'viewed_by_ip', 'view_session_id'],
      },
    ],
  }
);

MediaAsset.hasMany(MediaViewLog, { foreignKey: 'media_id' });
MediaViewLog.belongsTo(MediaAsset, { foreignKey: 'media_id' });

module.exports = MediaViewLog;
