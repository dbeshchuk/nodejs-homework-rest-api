const fs = require("fs/promises");
const path = require("path");
const shortid = require("shortid");

const contacts = path.resolve("./model/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contacts, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    return console.error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contacts, "utf-8");

    return JSON.parse(data).find(({ id }) => id.toString() === contactId);
  } catch (error) {
    return console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contacts, "utf-8");
    const parsedContacts = JSON.parse(data);
    const contact = parsedContacts.find(
      ({ id }) => id.toString() === contactId
    );

    if (contact) {
      const newContacts = parsedContacts.filter(
        ({ id }) => id.toString() !== contactId
      );

      await fs.writeFile(contacts, JSON.stringify(newContacts));

      return true;
    }

    return false;
  } catch (error) {
    return console.error(error);
  }
};

const addContact = async (body) => {
  try {
    const data = await fs.readFile(contacts, "utf-8");
    const newContact = { id: shortid.generate(), ...body };

    await fs.writeFile(
      contacts,
      JSON.stringify([...JSON.parse(data), newContact])
    );

    return newContact;
  } catch (error) {
    return console.error(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contacts, "utf-8");
    const parsedContacts = JSON.parse(data);

    const index = parsedContacts.findIndex(
      ({ id }) => id.toString() === contactId
    );

    if (index !== -1) {
      parsedContacts[index] = { ...parsedContacts[index], ...body };

      await fs.writeFile(contacts, JSON.stringify(parsedContacts));

      return parsedContacts[index];
    }
  } catch (error) {
    return console.error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
