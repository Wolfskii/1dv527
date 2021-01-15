const Joi = require('@hapi/joi')

// REGISTER VALIDATION USING JOI
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi
      .string()
      .min(6)
      .email()
      .required(),
    password: Joi
      .string()
      .min(6)
      .required()
  })

  return schema.validate(data)
}

// LOGIN VALIDATION USING JOI
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi
      .string()
      .min(6)
      .email()
      .required(),
    password: Joi
      .string()
      .min(6)
      .required()
  })

  return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
