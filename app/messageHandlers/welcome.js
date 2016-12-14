
const _ = require('lodash');

exports.handler = async function(message) {
  const messageContent = _.trim(message.content.split('!welcome')[1]);
  if(!messageContent) return;

  const [ command, ...args ] = messageContent.split(' ');
  message.reply(await (require('../welcomeMessageManager'))[command](this.welcomeMessage, ...args));
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
\`welcome get [username] [all]\`: \`welcome get Prometheus all\`
`);
