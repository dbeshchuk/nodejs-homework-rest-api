const User = require("./users");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return User.findOne({ email });
};

const findByToken = async (token) => {
  return User.findOne({ token });
};

const create = async (options) => {
  const user = new User(options);

  return await user.save();
};

const updateSubscription = async (body, token) => {
  try {
    const result = await User.findOneAndUpdate(
      { token: token },
      { ...body },
      { new: true }
    );

    return result;
  } catch (error) {
    return console.error(error);
  }
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

module.exports = {
  findById,
  findByEmail,
  findByToken,
  create,
  updateToken,
  updateAvatar,
  updateSubscription,
};
