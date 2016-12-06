
const wikiLib = require('wikijs').default;
const wiki = wikiLib({ apiUrl: 'http://coppermind.net/w/api.php' });

exports.search = async function(searchTerm) {
  const { results: [ result ] } = await wiki.search(searchTerm, 1);
  return result;
};

exports.findPage = async function(pageName) {
  return await wiki.page(pageName);
};
