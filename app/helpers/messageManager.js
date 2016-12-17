
const _ = require('lodash');

exports.add = async (db, message) => {
  try {
    const [,username] = /\[(.*)\]/.exec(message) || [];
    if(username)
      message = message.split(`] `)[1];
    await db.create({ message, username });
    return 'message has been created.';
  }
  catch(x) {
    if(x.code === 11000)
      console.log('duplicate record');
    else
      console.error(x);
    return 'I was unable to add that message.';
  }
};

exports.remove = async (db, _id) => {
  try {
    console.log(_id);
    await (db.find({ _id }).remove().exec());
    return 'message has been removed.';
  }
  catch(x) {
    console.error(x);
    return 'I was unable to remove that message.';
  }
};

exports.list = async (db, username) => {
  let welcomeMessages;
  welcomeMessages = username ?
    await (db.find({ username }).exec()) :
    await (db.find({}).exec());

  if(!welcomeMessages.length)
    return { error: 'no messages for that user.' };

  welcomeMessages = '\n' + _.map(welcomeMessages, ({ _id, message, username }) => `message: ${message}\nmessageID: ${_id}${username ? `\nusername: ${username}` : ''}`).join('\n\n');
  return welcomeMessages;
};

exports.getMessages = async (db, username) => {
  let welcomeMessages;
  welcomeMessages = username ?
    await (db.find({ username }).exec()) :
    await (db.find({}).exec());

  return _.map(welcomeMessages, 'message');
};
