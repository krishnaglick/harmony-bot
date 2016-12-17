
const bluebird = require('bluebird');
const _ = require('lodash');

const coppermind = require('../wiki/coppermind');

const wikis = [
  new coppermind()
];

exports.handler = async function(message) {
  if(message.channel.name === 'no_spoilers')
    return message.reply(`Sorry, I can't reply in the no_spoilers channel.`);

  const searchTerm = _.trim(message.content.split('!wiki')[1] || '');
  if(!searchTerm)
    return;

  try {
    const urls = await bluebird.map(wikis, async (wiki) => {
      const wikiPage = await wiki.findPage(searchTerm);
      const { fullurl, touched } = wikiPage.raw;
      if(!fullurl || !touched)
        return null;
      return fullurl;
    });

    const filteredUrls = _.filter(urls);
    const message = filteredUrls.length ?
      `Here are some link(s) to help you out!\n${_.filter(urls).join('\n')}` :
      `I couldn't find anything in my copperminds on that subject.`;

    message.reply(message);
  }
  catch(x) {
    console.error(x);
  }
};

exports.checks = [
  (message) => message.content.indexOf('!wiki') > -1
];

exports.requirements = [];

exports.helpMessage = _.trim(`
Using this command makes me search my copperminds for the requested information.
\`!wiki\` to use it
For example: \`!wiki kaladin\`
`);
