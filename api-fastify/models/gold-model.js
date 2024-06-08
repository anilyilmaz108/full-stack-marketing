const { DataTypes } = require('sequelize')
const db = require('../db/db')
const GOLD = db.sequelize.define('GOLD', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    altin: {
        type: DataTypes.STRING({ length: 50 }),
    },
    degisimaltin: {
        type: DataTypes.STRING({ length: 50 }),
    },
    tarihaltin: {
        type: DataTypes.STRING({ length: 50 }),
    }
    
}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'GOLD',
    tableName: 'gold',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = GOLD