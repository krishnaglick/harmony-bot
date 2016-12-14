
const _ = require('lodash');

exports.remove = async (welcomeMessage) => {
  return await (welcomeMessage.find({}, 'message').exec());
};

exports.add = async (welcomeMessage, username, message) => {
  try {
    username = ~~username ? username : null;
    console.log({message, username});
    await welcomeMessage.create({ message, username });
  }
  catch(x) {
    console.error(x);
  }
};

exports.get = async (welcomeMessage, username, all) => {
  let welcomeMessages;
  try {
    welcomeMessages = ~~username ?
    await (welcomeMessage.find({ username },  'message').exec()) :
    await (welcomeMessage.find({}, 'message').exec());
  }
  catch(x) {
    console.error(x);
  }

  welcomeMessages = _.map(welcomeMessages, 'message');

  return all ?
    welcomeMessages :
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
};
