const express = require("express");
const router = express.Router();

const {
  postValidation,
  patchValidation,
  statusValidation,
} = require("./validation");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../model/contacts/index");

const guard = require("../../helpers/guard");

router.get("/", guard, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const data = await listContacts(userId, req.query);

    return res.json({ status: "success", code: 200, data: { ...data } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", guard, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const contact = await getContactById(req.params.contactId, userId);

    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }

    return next();
  } catch (error) {
    next(error);
  }
});

router.post("/", guard, postValidation, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const newContact = await addContact({ ...req.body, owner: userId });

    return res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", guard, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const completed = await removeContact(req.params.contactId, userId);

    if (completed) {
      return res.json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId", guard, patchValidation, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const newContact = await updateContact(
      req.params.contactId,
      req.body,
      userId
    );

    if (newContact) {
      return res.json({ status: "success", code: 200, data: { newContact } });
    }

    return next();
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId/favorite",
  guard,
  statusValidation,
  async (req, res, next) => {
    try {
      const userId = req.user._id;

      const contact = await updateStatusContact(
        req.params.contactId,
        req.body,
        userId
      );

      if (contact) {
        return res.json({ status: "success", code: 200, data: { contact } });
      }

      return next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
