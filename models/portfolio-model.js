const { DataTypes } = require('sequelize')
const db = require('../db/db')
const Portfolio = db.sequelize.define('Portfolio', {
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
    dolar: {
        type: DataTypes.STRING({ length: 50 }),
    },
    euro: {
        type: DataTypes.STRING({ length: 50 }),
    },
    altin: {
        type: DataTypes.STRING({ length: 50 }),
    },
    hisse: {
        type: DataTypes.ARRAY( DataTypes.TEXT ),
    },
    lira: {
        type: DataTypes.STRING({ length: 50 }),
    },
}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'Portfolio',
    tableName: 'portfolio',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = Portfolio