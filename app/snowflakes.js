
const snowflakes = {
  LordMistborn: `We trade one Lord Ruler for another <@id>`,
  eviljer: `Welcome <@id>, you have a hard road in front of you.`
};

module.exports = function(user) {
  return snowflakes[user.username] ? snowflakes[user.username].replace('id', user.id) : null;
};
