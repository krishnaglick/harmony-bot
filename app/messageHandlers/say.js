
const _ = require('lodash');

module.exports = async function(message) {
  if(message.content.indexOf('!say') > -1 && message.author.id === '209703838117003264') {
    const messageContent = _.trim(message.content.split('!say')[1] || 'Follow the Path');
    message.channel.sendMessage(messageContent); //TODO: Allow customizing channels?
  }
};
