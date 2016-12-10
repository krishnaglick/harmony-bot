
const path = require('path');
const globby = require('globby');
const _ = require('lodash');

const userPerms = {};

module.exports = async function(message) {
  if(userPerms[message.author.id] && userPerms[message.author.id].length)
    return userPerms[message.author.id];

  const messageHandlerPaths = _.map(await globby('./app/messageHandlers/*.js'), p => path.resolve(p));
  userPerms[message.author.id] = _.filter(_.map(messageHandlerPaths, (handlerPath) => {
    const handlerName = handlerPath.split(path.sep).slice(-1)[0].split('.')[0];
    const { requirements } = require(handlerPath);
    const msg = _.merge({}, message, { content: `!${handlerName}` });
    const requirementsResults = _.map(requirements, r => r(msg));
    const canUseHandler = _.reduce(requirementsResults, (a, b) => a && b);
    if(canUseHandler || !requirements.length)
      return handlerName;
    return null;
  }));

  return userPerms[message.author.id];
};