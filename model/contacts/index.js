const Contact = require("./contacts");

const listContacts = async (userId, query) => {
  try {
    // const results = await Contact.find({ owner: userId }).populate({
    //   path: "owner",
    //   select: "email subscription",
    // });

    const { limit = 5, page = 1, favorite = null } = query;

    const searchOptions = { owner: userId };

    if (favorite !== null) {
      searchOptions.favorite = favorite;
    }

    const results = await Contact.paginate(searchOptions, {
      limit,
      page,
      customLabels: { docs: "contacts", totalDocs: "totalContacts" },
    });

    return results;
  } catch (error) {
    return console.error(error);
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({ path: "owner", select: "email subscription" });

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const result = await Contact.findOneAndRemove({
      _id: contactId,
      owner: userId,
    });

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

const updateContact = async (contactId, body, userId) => {
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true }
    );

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const updateStatusContact = async (contactId, body, userId) => {
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
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
