
const discord = require('discord.js');

let names = {};
let defaultChannel;
let fbStore;

const getWelcomeMessage = function() {
  const welcomeMessages = require('./welcomeMessages');
  const index = Math.floor(Math.random() * (welcomeMessages.length - 0) + 0);
  return welcomeMessages[index];
};

exports.start = async function(client, firebaseStore) {
  fbStore = firebaseStore;
  client.on('ready', async () => {
    console.log(`[${new Date().toTimeString()}] Bot On`);
    try {
      await client.user.setUsername('Harmony');
    }
    catch(x) {
      console.error(x);
    }
  });

  client.on('message', async (message) => {
    const wiki = require('./wiki');
    try {
      if(!message)
        return console.log('No message!');
      if(message.author.id === '209703838117003264')
        message.reply(message.content.split('!say')[1] || 'Follow the Path');
      if(message.author.bot || message.content.indexOf('!wiki') === -1)
        return;
      if(message.channel.name === 'no_spoilers')
        return message.reply(`Sorry, I can't reply in the no_spoilers channel.`);
      if(process.env.NODE_ENV !== 'production' && message.channel.name !== 'bot-testing')
        return;
      if(process.env.NODE_ENV === 'production' && message.channel.name === 'bot-testing')
        return;
      const searchTerms = /!wiki (.*)/gi.exec(message.content);
      if(searchTerms && searchTerms.length > 1 && searchTerms[1]) {
        const searchTerm = await wiki.search(searchTerms[1]);
        if(!searchTerm)
          return message.reply(`Sorry, I couldn't find anything about that in my copperminds.`);
        const wikiData = await wiki.findPage(searchTerm);
        const url = wikiData.raw.fullurl;
        const botMessage = `Read up on ${searchTerm} here! ${url}`;
        message.reply(botMessage);
      }
    }
    catch(x) {
      console.error(x);
    }
  });

  client.on('presenceUpdate', async (old, neu) => {
    if(old.presence.status !== 'offline' || neu.presence.status !== 'online')
      return;
    const snowflakes = require('./snowflakes');
    const { id, username } = neu.user;
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
      if(old.presence.status === 'offline' && neu.presence.status === 'online') {
        if(!snowflakes(neu.user)) {
          if(!names[id])
            names[id] = username;
          if(!defaultChannel)
            defaultChannel = neu.guild.defaultChannel;
        }
        try {
          const message = snowflakes(neu.user);
          if(message)
            await neu.guild.defaultChannel.sendMessage(message);
        }
        catch(x) {
          console.error(x);
        }
      }
    }
  });

  try {
    let config = {};
    try {
      config = require('../config');
    }
    catch(x) {
      console.warn('No config file, I hope your env is set!');
    }
    const secret = process.env.CLIENT_SECRET || config.clientSecret;
    if(!secret) {
      console.error('Need a secret for harmony-bot!');
      process.exit(1);
    }
    await client.login(secret);
  }
  catch(x) {
    console.error(x);
  }
};

setInterval(async () => {
  const keys = Object.keys(names);
  if(keys.length > 0) {
    try {
      const message = getWelcomeMessage().replace('<names>', keys.map(key => `<@${key}>`).join(', '));
      await defaultChannel.sendMessage(message);
      names = {};
    }
    catch(x) {
      console.error(x);
    }
  }
}, 120000);

exports.stop = async function(client) {
  console.log(`[${new Date().toTimeString()}] Bot Off`);
  try {
    await client.destroy();
  }
  catch(x) {
    console.error(x);
  }
};

exports.init = async function() {
  return new discord.Client();
};
