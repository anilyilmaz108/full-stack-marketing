const { DataTypes } = require('sequelize')
const db = require('../db/db')
const User = db.sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    email: {
        type: DataTypes.STRING({ length: 50 }),
    },
    password: {
        type: DataTypes.STRING({ length: 50 }),
    },
    role: {
        type: DataTypes.STRING({ length: 50 }),
        defaultValue: 'user'
    }


}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = User