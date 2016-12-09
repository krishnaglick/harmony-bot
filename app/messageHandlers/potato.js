

module.exports = async function(message) {
  if(message.content.indexOf('potato') > -1) {
    message.channel.sendMessage('potato');
  }
};
