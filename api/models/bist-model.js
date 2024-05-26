const { DataTypes } = require('sequelize')
const db = require('../db/db')
const Bist = db.sequelize.define('Bist', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    bist: {
        type: DataTypes.STRING({ length: 50 }),
    },
    degisimBist: {
        type: DataTypes.STRING({ length: 50 }),
    },
    tarihBist: {
        type: DataTypes.STRING({ length: 50 }),
    }
    
}, {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    modelName: 'Bist',
    tableName: 'bist',
    timestamps: true,
    version: true,
    underscored: true
})



module.exports = Bist