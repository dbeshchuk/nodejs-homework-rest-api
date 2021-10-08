const Contact = require("./contacts");

const listContacts = async () => {
  try {
    const results = await Contact.find({});

    return results;
  } catch (error) {
    return console.error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const result = await Contact.findById(contactId);

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndRemove({ _id: contactId });

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const addContact = async (body) => {
  try {
    const result = Contact.create({ favorite: false, ...body });

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true }
    );

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true }
    );

    return result;
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
  updateStatusContact,
};
