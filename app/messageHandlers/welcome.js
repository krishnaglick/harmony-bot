
const _ = require('lodash');

exports.handler = async function(message) {
  const messageContent = _.trim(message.content.split('!welcome')[1]);
  if(!messageContent) return;

  const [ command, ...args ] = messageContent.split(' ');
  const messageManager = require('../helpers/messageManager');
  if(!messageManager[command])
    message.reply(`I don't have that command`);
  try {
    const message = await messageManager[command](this.welcomeMessage, args.join(' '));
    message.reply(message.error || message);
  }
  catch(x) {
    console.error(x);
    message.reply(`There was an issue, please contact Prometheus`);
  }
};

exports.checks = [
  (message) => message.content.indexOf('!welcome') > -1
];

exports.requirements = [
  (message) => message.member.permissions.hasPermission('MANAGE_CHANNELS')
];

exports.helpMessage = `
\`!welcome list {username}\`: \`welcome list\` or \`welcome list Prometheus\`
\`!welcome add [username] message\`: \`!welcome add Hello <@id>. I hope you do this correctly.\` or \`!welcome add [Prometheus] Greetings <@id>.\`
\`!welcome remove messageID\`: \`!welcome remove IAmAnID\`
`;
