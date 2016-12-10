
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
  const messageHandlerPaths = _.map(await globby('./app/messageHandlers/*.js'), p => path.resolve(p));
  const sortedHandlerPaths = _.sortBy(messageHandlerPaths, (path) => {
    return ~path.indexOf('help');
  });
  for(let i = 0; i < sortedHandlerPaths.length - 1; i++) {
    try {
      const handlerName = sortedHandlerPaths[i].split(path.sep).slice(-1)[0].split('.')[0];
      const { handler, checks } = require(sortedHandlerPaths[i]);
      const hasPermission = permissions.indexOf(handlerName) > -1;
      const checksPassed = _.reduce(_.map(checks, c => c(message), (a, b) => a && b));
      if(hasPermission && checksPassed) {
        return await handler(message, permissions);
      }
    }
    catch(x) {
      console.error(x);
    }
  }
};

/*exports.presenceUpdate = async function(oldUser, newUser) {
  //I need a refactor. Might not be necessary even!
  if(oldUser.presence.status !== 'offline' || newUser.presence.status !== 'online')
    return;
  const snowflakes = require('./snowflakes');
  const { id, username } = newUser.user;
  let haveUser;
  try {
    haveUser = await fbStore.database().ref(`${id}`).once('value');
  }
  catch(x) {
    console.warn(x);
  }
  if(!haveUser.val()) {
    try {
      await fbStore.database().ref(`${id}`).set({
        id: username
      });
    }
    catch(x) {
      console.error(x);
    }
    if(oldUser.presence.status === 'offline' && newUser.presence.status === 'online') {
      if(!snowflakes(newUser.user)) {
        if(!names[id])
          names[id] = username;
        if(!defaultChannel)
          defaultChannel = newUser.guild.defaultChannel;
      }
      try {
        const message = snowflakes(newUser.user);
        if(message)
          await newUser.guild.defaultChannel.sendMessage(message);
      }
      catch(x) {
        console.error(x);
      }
    }
  }
};*/
