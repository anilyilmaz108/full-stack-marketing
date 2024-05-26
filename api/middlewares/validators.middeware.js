const { body, param, query } = require('express-validator')

const validateUser = () => {
    return [body('email').isEmail().withMessage('Email Formatında Olmalı'),
        body('password')
        .notEmpty({ ignore_whitespace: true }).withMessage('Parola Girmelisin')
        .isLength({ min: 6, max: 18 }).withMessage((value, { req, location, path }) => {
            return { value, location, path }
        }).custom((value, { req }) => {
            //email var mı kontrol et ? parola son 3 aydaki parolan olamaz 
            if (value === "00000000") {
                throw new Error('Parola altı tane sıfır Olamaz')
            }
            return true
        }).withMessage('Parola altı tane sıfır Olamaz')
    ]
}

const validateGetUserById = () => {
    return [param('userId').notEmpty({ ignore_whitespace: true }).withMessage('User Id Olmak Zorundadır')
        .isLength({ max: 1 }).withMessage('Id Yalnızca 1 Karakterden Oluşabilir')
    ]
}

const validateQuery = () => {
    return [query('limit').notEmpty({ ignore_whitespace: false }).withMessage('Bu değer boş olamaz')]
}

module.exports = {
    validateUser,
    validateGetUserById,
    validateQuery
}