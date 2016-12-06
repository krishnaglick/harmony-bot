
const snowflakes = {
  LordMistborn: `We trade one lord ruler for another <@id>`
};

module.exports = function(user) {
  return snowflakes[user.username] ? snowflakes[user.username].replace('id', user.id) : null;
};
