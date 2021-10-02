const express = require("express");
const router = express.Router();

const { postValidation, patchValidation } = require("./validation");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../model");

router.get("/", async (_req, res, next) => {
  try {
    const contacts = await listContacts();

    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);

    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }

    return next();
  } catch (error) {
    next(error);
  }
});

router.post("/", postValidation, async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);

    return res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const completed = await removeContact(req.params.contactId);

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

router.patch("/:contactId", patchValidation, async (req, res, next) => {
  try {
    const newContact = await updateContact(req.params.contactId, req.body);

    if (newContact) {
      return res.json({ status: "success", code: 200, data: { newContact } });
    }

    return next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
