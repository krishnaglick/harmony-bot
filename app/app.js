
const Discord = require('discord.js');
const welcomeMessages = require('./welcomeMessages');
const snowflakes = require('./snowflakes');
const config = require('../config');

let names = {};
let defaultChannel;

const getWelcomeMessage = function() {
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

  client.on('message', (message) => {
    if(!message)
      return console.log('No message!');
    /*if (message.content === 'ping') {
      message.reply('pong');
    }*///Leaving this in for later interaction potentially
  });

  client.on('presenceUpdate', async (old, neu) => {
    const { id, username } = neu.user;
    if(old.presence.status === 'offline' && neu.presence.status === 'online') {
      if(!snowflakes(neu.user)) {
        if(!names[id])
          names[id] = username;
        if(!defaultChannel)
          defaultChannel = neu.guild.defaultChannel;
      }
      try {
        const message = snowflakes(neu.user);// || `${getWelcomeMessage().replace('id', id)}`;
        if(message)
          await neu.guild.defaultChannel.sendMessage(message);
      }
      catch(x) {
        console.error(x);
      }
    }
  });

  try {
    await client.login(process.env.CLIENT_SECRET || config.clientSecret);
  }
  catch(x) {
    console.error(x);
  }
};

setInterval(async () => {
  const keys = Object.keys(names);
  if(keys.length > 0) {
    try {
      const message = getWelcomeMessage().replace('<names>', keys.map(id => `<@${id}>`).join(', '));
      await defaultChannel.sendMessage(message);
      names = {};
    }
    catch(x) {
      console.error(x);
    }
  }
}, 60000);

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
