
const _ = require('lodash');

exports.handler = async function(message) {
  const messageContent = _.trim(message.content.split('!say')[1] || 'Follow the Path');
  message.channel.sendMessage(messageContent); //TODO: Allow customizing channels?
};

exports.checks = [
  (message) => message.content.indexOf('!say') > -1
]

exports.requirements = [
  (message) => message.member.permissions.hasPermission('MANAGE_CHANNELS')
];
