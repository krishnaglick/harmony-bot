
const _ = require('lodash');

exports.handler = async function(message, permissions) {
  if(_.trim(message.content) === '!help') {
    const formattedPermissions = _.map(permissions, p => `!${p}`).join(', ');
    message.reply(`The following commands are available: ${formattedPermissions}`);
  }
  else {
    const messageCommand = message.content.split('!help ')[1];
    const [ command ] = _.filter(permissions, (perm) => {
      if(messageCommand.indexOf(perm) > -1)
        return perm;
      return null;
    });
    const { helpMessage } = require(`./${command}`);
    message.reply(helpMessage);
  }
};

exports.checks = [
  (message) => message.content.indexOf('!help') > -1
];

exports.requirements = [];

exports.helpMessage = 'I list out help commands, type !help to see them!';
