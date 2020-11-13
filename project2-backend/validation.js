const Joi = require('@hapi/joi');

function RegisterValidation(data) {
    const schema = {
        email: Joi.string().optional().email(),
        password: Joi.string().min(4).required(),
    }

    return Joi.validate(data, schema);
}


function LoginValidation(data) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required()
    }

    return Joi.validate(data, schema);
}

module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;