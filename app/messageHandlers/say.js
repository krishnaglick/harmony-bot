
const _ = require('lodash');

exports.handler = async function(message) {
  const messageContent = _.trim(message.content.split('!say')[1] || 'Follow the Path');
  const channelRegex = /\[(.*)\]/gi;
  const channelRegexResult = channelRegex.exec(messageContent);
  if(channelRegexResult) {
    const [ targetChannelText, targetChannel ] = channelRegexResult;
    const channel = message.guild.channels.find(c => c.name === targetChannel);
    if(channel)
      return channel.sendMessage(messageContent.replace(targetChannelText, ''));
    else
      return message.reply(`The channel \`${targetChannel}\` does not exist.`);
  }

  message.channel.sendMessage(messageContent);
};

exports.checks = [
  (message) => message.content.indexOf('!say') > -1
];

exports.requirements = [
  (message) => message.member.permissions.hasPermission('MANAGE_CHANNELS')
];

exports.helpMessage = _.trim(`
This makes me talk, if you require such frivolity.
\`!say\` activates the command
\`!say [channel_name]\` will send the message to the specified channel
`);
