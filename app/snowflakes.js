
const snowflakes = {
  LordMistborn: `We trade one Lord Ruler for another <@id>`,
  eviljer: `Hello <@id>, would you like to destroy some evil today?`
};

module.exports = function(user) {
  return snowflakes[user.username] ? snowflakes[user.username].replace('id', user.id) : null;
};
