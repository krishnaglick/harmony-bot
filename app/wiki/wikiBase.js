
const wikiLib = require('wikijs').default;

class wiki {
  constructor(wikiUrl) {
    if(!wikiUrl)
      throw 'Need a url!';

    this.wiki = wikiLib({ apiUrl: wikiUrl });
  }

  async search(searchTerm) {
    const { results: [ result ] } = await this.wiki.search(searchTerm, 1);
    return result;
  }

  async findPage(pageName) {
    return await this.wiki.page(pageName);
  }
}

module.exports = wiki;
