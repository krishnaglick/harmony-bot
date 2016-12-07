
const Discord = require('discord.js');

let names = {};
let defaultChannel;

const getWelcomeMessage = function() {
  const welcomeMessages = require('./welcomeMessages');
  const index = Math.floor(Math.random() * (welcomeMessages.length - 0) + 0);
  return welcomeMessages[index];
};

exports.start = async function(client) {
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
    const snowflakes = require('./snowflakes');
    const { id, username } = neu.user;
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
      const message = getWelcomeMessage().replace('<names>', keys.map(key => names[key]).join(', '));
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
  return new Discord.Client();
};
