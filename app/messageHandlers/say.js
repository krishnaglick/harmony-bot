
const _ = require('lodash');

module.exports = async function(message) {
  if(message.content.indexOf('!say') > -1 && message.member.permissions.hasPermission('MANAGE_CHANNELS')) {
    const messageContent = _.trim(message.content.split('!say')[1] || 'Follow the Path');
    message.channel.sendMessage(messageContent); //TODO: Allow customizing channels?
  }
};
