const { DataTypes } = require('sequelize')
const db = require('../db/db')
const Follow = db.sequelize.define('Follow', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    user: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    hisse: {
        type: DataTypes.STRING({ length: 50 }),
        allowNull: false,
    },
}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'Follow',
    tableName: 'follow',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = Follow