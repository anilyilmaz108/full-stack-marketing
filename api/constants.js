const jwt = require('jsonwebtoken')
require("dotenv").config({
    override: true,
  });
const token = jwt.sign({
    email: `${process.env.EMAIL}`,
    ad: `${process.env.NAME}`,
    exp: Math.floor(Date.now() / 1000) + 60,
    issuer: `${process.env.ISSUER}`
}, 'secretKey')


const hashToPassword = (password) => {
    const md5 = require('md5')
    return md5(password)
}



module.exports = {
    token,
    hashToPassword
}
