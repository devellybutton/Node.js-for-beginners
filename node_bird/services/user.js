const User = require("../models/user");

exports.follow = async (userId, followingId) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      await user.addFollowing(parseInt(followingId, 10));
      return "ok";
    } else {
      return "no user";
    }
  } catch (error) {
    return error;
  }
};
