
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
  client.on('ready', () => {
    console.log(`[${new Date().toTimeString()}] Bot On`);
    try {
      client.user.setUsername('Harmony');
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
    const { id } = neu.user;
    if(old.presence.status !== 'online' && neu.presence.status === 'online') {
      if(!snowflakes(neu.user)) {
        if(!names[id])
          names[id] = id;
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

  client.login(process.env.CLIENT_SECRET || config.clientSecret);
};

setInterval(async () => {
  const keys = Object.keys(names);
  if(keys.length > 0) {
    try {
      console.log(keys);
      const message = getWelcomeMessage().replace('<names>', keys.map(id => `<@${id}>`).join(', '));
      await defaultChannel.sendMessage(message);
    }
    catch(x) {
      console.error(x);
    }
  }
}, 60000);

exports.stop = async function(client) {
  console.log(`[${new Date().toTimeString()}] Bot Off`);
  client.destroy();
};

exports.init = async function() {
  return new Discord.Client();
};
