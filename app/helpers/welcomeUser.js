
const snowflakes = {
  LordMistborn: `We trade one Lord Ruler for another <@id>`,
  eviljer: `Hello <@id>, would you like to destroy some evil today?`
};

const welcomeMessages = [
  'Welcome <@id>. May the Stormfather watch over you.',
  'Welcome <@id>. I hope the Survivor looks out for your future welfare.',
  'Welcome <@id>. May Ironeyes never catch sight of thee.',
  'Welcome <@id>. May the Shaod never come for you.',
  'Welcome <@id>. May Domi guide you.',
  'Welcome <@id>. The Ascendant Warrior fights beside you.',
  'Welcome <@id>. Wayne\'s already taken your hat.',
  'Welcome <@id>. Awespren surround you.'
];

const messageManager = require('./messageManager');
const _ = require('lodash');

exports.handlePresence = async function(discordUser, db)  {
  const { user: { id, username } } = discordUser;
  let messages = await messageManager.getMessages(db, username);
  if(!messages.length)
    messages = await messageManager.getMessages(db);

  const message = messages[Math.floor(Math.random() * messages.length)];
  try {
    let channel;
    if(process.env.NODE_ENV !== 'production')
      channel = discordUser.guild.channels.find(c => c.name === 'bot-testing');
    else
      channel = discordUser.guild.defaultChannel;
    await channel.sendMessage(
      message.replace('id', id)
    );
  }
  catch(x) {
    console.error(x);
  }
};

exports.seed = async function(db) {
  _.forEach(welcomeMessages, async (msg) => {
    try {
      await messageManager.add(db, msg);
    }
    catch(x) {}
  });
  _.forEach(Object.keys(snowflakes), async (key) => {
    try {
      await messageManager.add(db, `[${key}] ${snowflakes[key]}`);
    }
    catch(x) {}
  });
};
