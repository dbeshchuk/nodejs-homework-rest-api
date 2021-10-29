const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const mkdirp = require("mkdirp");

require("dotenv").config();

const {
  userValidation,
  subscriptionValidation,
  emailValidation,
} = require("./validation");

const upload = require("../../helpers/uploads");
const FileUpload = require("../../services/file-upload");

const EmailService = require("../../services/email/service");
const { CreateSenderNodemailer } = require("../../services/email/sender");

const {
  findByEmail,
  findByToken,
  create,
  updateToken,
  updateAvatar,
  updateSubscription,
  updateTokenVerify,
  findUserByVerifyToken,
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

    const emailService = new EmailService(
      "development",
      new CreateSenderNodemailer()
    );

    const statusEmail = await emailService.sendVerifyEmail(
      newUser.email,
      newUser.name,
      newUser.verifyToken
    );

    console.log(statusEmail);

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatarURL,
          successEmail: statusEmail,
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

    if (!user || !isValidPassword || !user?.verify) {
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

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const user = await findUserByVerifyToken(req.params.verificationToken);

    console.log(req.params.verificationToken);

    if (user) {
      await updateTokenVerify(user._id, true, null);

      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification success",
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", emailValidation, async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);

    if (user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    }

    if (user) {
      const emailService = new EmailService(
        "development",
        new CreateSenderNodemailer()
      );

      await emailService.sendVerifyEmail(
        user.email,
        user.name,
        user.verifyToken
      );
    }

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
