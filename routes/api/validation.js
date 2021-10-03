const Joi = require("joi");

const postValidation = async (req, _res, next) => {
  try {
    const postSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(3).max(30).required(),
    });

    await postSchema.validateAsync(req.body);

    return next();
  } catch (error) {
    next(error);
  }
};

const patchValidation = async (req, _res, next) => {
  try {
    const patchSchema = Joi.object({
      name: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      phone: Joi.string().min(3).max(30),
    }).or("name", "email", "phone");

    await patchSchema.validateAsync(req.body);

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = { postValidation, patchValidation };
