const { DataTypes } = require('sequelize')
const db = require('../db/db')
const USD = db.sequelize.define('USD', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    dolar: {
        type: DataTypes.STRING({ length: 50 }),
    },
    degisimdolar: {
        type: DataTypes.STRING({ length: 50 }),
    },
    tarihdolar: {
        type: DataTypes.STRING({ length: 50 }),
    }
    
}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'USD',
    tableName: 'usd',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = USD