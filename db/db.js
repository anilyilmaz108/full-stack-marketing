const { Sequelize, DataTypes } = require('sequelize')
const db = {}
const sequelize = new Sequelize('liveapidb', 'postgres', '176369', {
    dialect: 'postgres',
    logging: true,
    retry: 3
})
db.Sequelize = Sequelize
db.sequelize = sequelize

db.connect = () => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.sequelize.authenticate({ logging: true })
            console.log('Bağlantı Başarıyla Gerçekleşti')
            resolve(db)

        } catch (error) {
            console.log('error', error)
            reject(error)
        }
    })
}
db.createTables = async() => {
    const User = require('../models/user-model')
    const Follow = require('../models/follow-model')
    const Share = require('../models/share-model')
    const Bist = require('../models/bist-model')
    const Euro = require('../models/euro-model')
    const Usd = require('../models/usd-model')
    const Gold = require('../models/gold-model')

    User.hasMany(Follow, { foreignKey: 'user_id', onDelete: 'CASCADE', hooks: true })
    Share.hasMany(Follow, { foreignKey: 'share_id', onDelete: 'CASCADE', hooks: true })
    //User.belongsToMany(Share, { through: Follow, foreignKey: 'user_id',  onDelete: 'CASCADE', hooks: true })
    //Share.belongsToMany(User, { through: Follow, foreignKey: 'hisse',  onDelete: 'CASCADE', hooks: true })

    sequelize.sync({ force: true })
}


module.exports = db