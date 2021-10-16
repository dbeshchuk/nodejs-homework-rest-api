const Joi = require("joi");

const postValidation = async (req, _res, next) => {
  try {
    const postSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(3).max(30).required(),
      favorite: Joi.boolean().optional(),
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
      favorite: Joi.boolean().optional(),
    }).or("name", "email", "phone", "favorite");

    await patchSchema.validateAsync(req.body);

    return next();
  } catch (error) {
    next(error);
  }
};

const statusValidation = async (req, _res, next) => {
  try {
    const statusSchema = Joi.object({
      favorite: Joi.boolean()
        .required()
        .messages({ "any.required": "missing field favorite" }),
    });

    await statusSchema.validateAsync(req.body);

    return next();
  } catch (error) {
    next(error);
  }
};

const userValidation = async (req, _res, next) => {
  try {
    const userSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(30).required(),
    });

    await userSchema.validateAsync(req.body);

    return next();
  } catch (error) {
    next(error);
  }
};

const subscriptionValidation = async (req, _res, next) => {
  try {
    const subscriptionSchema = Joi.object({
      subscription: Joi.string().valid("starter", "pro", "business").required(),
    });

    await subscriptionSchema.validateAsync(req.body);

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postValidation,
  patchValidation,
  statusValidation,
  userValidation,
  subscriptionValidation,
};
