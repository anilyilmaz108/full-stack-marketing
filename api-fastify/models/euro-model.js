const { DataTypes } = require('sequelize')
const db = require('../db/db')
const EURO = db.sequelize.define('EURO', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    euro: {
        type: DataTypes.STRING({ length: 50 }),
    },
    degisimeuro: {
        type: DataTypes.STRING({ length: 50 }),
    },
    tariheuro: {
        type: DataTypes.STRING({ length: 50 }),
    }
    
}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'EURO',
    tableName: 'euro',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = EURO