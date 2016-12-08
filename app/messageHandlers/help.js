
module.exports = async function(message) {
  if(message.content.indexOf('!help') > -1) {
    message.reply('The following commands are available: !help, !wiki');
  }
};
