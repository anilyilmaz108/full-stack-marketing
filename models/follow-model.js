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
    hisse: {
        type: DataTypes.STRING({ length: 50 }),
    },
    sonFiyat: {
        type: DataTypes.STRING({ length: 50 }),
    },
    satisFiyat: {
        type: DataTypes.STRING({ length: 50 }),
    },
    fiyat: {
        type: DataTypes.STRING({ length: 50 }),
    },
    dusukFiyat: {
        type: DataTypes.STRING({ length: 50 }),
    },
    ortalama: {
        type: DataTypes.STRING({ length: 50 }),
    },
    yuzde: {
        type: DataTypes.STRING({ length: 50 }),
    },
    dunKapanis: {
        type: DataTypes.STRING({ length: 50 }),
    },
    fark: {
        type: DataTypes.STRING({ length: 50 }),
    },
    taban: {
        type: DataTypes.STRING({ length: 50 }),
    },
    tavan: {
        type: DataTypes.STRING({ length: 50 }),
    },
    hacimLot: {
        type: DataTypes.STRING({ length: 50 }),
    },
    hacim: {
        type: DataTypes.STRING({ length: 50 }),
    },
    saat: {
        type: DataTypes.STRING({ length: 50 }),
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