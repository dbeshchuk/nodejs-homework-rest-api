const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { userValidation, subscriptionValidation } = require("./validation");

const {
  findByEmail,
  findByToken,
  create,
  updateToken,
  updateSubscription,
} = require("../../model/users/index");

const { HttpCode } = require("../../config/constants");
const guard = require("../../helpers/guard");

router.post("/signup", userValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }

    const newUser = await create({ email, password });

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", userValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);

    const isValidPassword = await user?.isValidPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const id = user._id;

    const payload = { id };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });

    await updateToken(id, token);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", guard, async (req, res, next) => {
  const id = req.user._id;

  await updateToken(id, null);

  return res.status(HttpCode.NO_CONTENT).json();
});

router.get("/current", guard, async (req, res, next) => {
  const user = await findByToken(req.user.token);

  if (user) {
    return res.json({
      status: "success",
      code: 200,
      data: { email: user.email, subscription: user.subscription },
    });
  }

  next();
});

router.patch("/", guard, subscriptionValidation, async (req, res, next) => {
  const user = await updateSubscription(req.body, req.user.token);

  if (user) {
    return res.json({
      status: "success",
      code: 200,
      data: { email: user.email, subscription: user.subscription },
    });
  }

  next();
});

module.exports = router;
