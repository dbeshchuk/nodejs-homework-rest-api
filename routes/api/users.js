const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const mkdirp = require("mkdirp");

require("dotenv").config();

const { userValidation, subscriptionValidation } = require("./validation");

const upload = require("../../helpers/uploads");
const FileUpload = require("../../services/file-upload");

const {
  findByEmail,
  findByToken,
  create,
  updateToken,
  updateAvatar,
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

    // console.log(newUser.avatar);

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatarURL,
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

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });

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

router.patch(
  "/avatars",
  guard,
  upload.single("avatar"),
  async (req, res, next) => {
    const id = String(req.user._id);

    // console.log(id);

    const file = req.file;

    const destination = path.join("public/avatars", id);
    await mkdirp(destination);

    const uploadService = new FileUpload(destination);

    const url = await uploadService.save(file, id);

    await updateAvatar(id, url);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        avatarURL: url,
      },
    });
  }
);

module.exports = router;
