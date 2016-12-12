
const _ = require('lodash');

const actions = {
  remove: async (welcomeMessage) => {
    return await (welcomeMessage.find({}, 'message').exec());
  },
  add: async (welcomeMessage, message, username) => {
    try {
      await (welcomeMessage.create({ message, username }).exec());
    }
    catch(x) {
      console.error(x);
    }
  },
  get: async (welcomeMessage, username, all) => {
    const welcomeMessages = username ?
    await (welcomeMessage.find({ username },  'message').exec()) :
    await (welcomeMessage.find({}, 'message').exec());

    return all ?
      welcomeMessages :
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }
};

exports.handler = async function(message) {
  const messageContent = _.trim(message.content.split('!welcome')[1]);
  if(!messageContent) return;

  const [ command, ...args ] = messageContent.split(' ');
  message.reply(await actions[command](...args));
};

exports.checks = [
  (message) => message.content.indexOf('!welcome') > -1
];

exports.requirements = [
  (message) => message.member.permissions.hasPermission('MANAGE_CHANNELS')
];

exports.helpMessage = _.trim(`
\`!welcome remove message\`: \`!welcome remove This is an entire message I don't like\`
\`!welcome add message [username]\`: \`!welcome add Hello <@id>. I hope you do this correctly.\`
\`welcome get [username] [all]\`: \`welcome get Prometheus y\`
`);
