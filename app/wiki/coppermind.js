
const wiki = require('./wikiBase');

const coppermindUrl = 'http://coppermind.net/w/api.php';

class coppermind extends wiki {
  constructor() {
    super(coppermindUrl);
  }
}

module.exports = coppermind;
