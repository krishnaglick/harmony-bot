
const globby = require('globby');
const path = require('path');
const _ = require('lodash');

exports.ready = async function() {
  console.log(`[${new Date().toTimeString()}] Bot On`);
  try {
    await this.client.user.setUsername('Harmony');
  }
  catch(x) {
    console.error(x);
  }
};

exports.message = async function(message) {
  if(!message || message.author.bot)
    return;
  if(process.env.NODE_ENV !== 'production' && message.channel.name !== 'bot-testing')
    return;

  const permissions = await require('./permissions')(message);
  const handlerPaths = _.map(await globby('./app/messageHandlers/*.js'), p => path.resolve(p));
  const [ command ] = _.filter(message.content.split(' '), (word) => {
    return permissions.indexOf(word.split('!')[1]) > -1 && word[0] === '!' ?
      word :
      null;
  });
  const [ handlerPath ] = _.filter(handlerPaths, p => p.indexOf(command.split('!')[1]) > -1);
  if(handlerPath) {
    const { handler, checks } = require(handlerPath);
    const hasPermission = permissions.indexOf(command.split('!')[1]) > -1;
    const checksPassed = _.reduce(_.map(checks, c => c(message), (a, b) => a && b));
    if(hasPermission && checksPassed) {
      handler.call(this, message, permissions);
    }
  }
};

exports.presenceUpdate = async function(oldUser, newUser) {
  if(!this.mongoose || !this.user)
    return;
  if(oldUser.presence.status !== 'offline' || newUser.presence.status !== 'online')
    return;
  const { id, username } = newUser.user;
  try {
    const user = await (this.user.findOne({ id }).exec());
    if(!user) {
      await require('./welcomeUser').handlePresence(newUser, this.welcomeMessage);
      await this.user.create({id, username});
    }
  }
  catch(x) {
    console.error(x);
  }
};
