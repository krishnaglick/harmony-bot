
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

module.exports = async function(discordUser)  {
  const { user: { id, username } } = discordUser;
  const message = snowflakes[username] ?
    snowflakes[username] :
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
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
