const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

exports.removeRoom = async (roomId) => {
  try {
    await Room.remove({ _Id: roomId });
    await Chat.remove({ room: roomId });
  } catch (error) {
    throw error;
  }
};
