const joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6),
    gender: joi.string(),
    age: joi.number().min(1),
    role:joi.string().required()
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6)
  });

  return schema.validate(data);
};

const resendMailValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email()
  });

  return schema.validate(data);
};

module.exports = { registerValidation,loginValidation,resendMailValidation };
