
const _ = require('lodash');

exports.handler = async function(message, permissions) {
  const formattedPermissions = _.map(permissions, p => `!${p}`).join(', ');
  message.reply(`The following commands are available: ${formattedPermissions}`);
};

exports.checks = [
  (message) => message.content.indexOf('!help') > -1
];

exports.requirements = [];
