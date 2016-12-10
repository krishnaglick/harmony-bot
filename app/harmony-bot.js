
const discord = require('discord.js');
const _ = require('lodash');

class bot {
  constructor(secret, mongoose) {
    this.client = new discord.Client();
    this.secret = secret;
    this.mongoose = mongoose;
  }

  async start() {
    const events = require('./events');
    _.forEach(Object.keys(events), (key) => {
      this.client.on(key, events[key].bind(this));
    });

    try {
      await this.client.login(this.secret);
    }
    catch(x) {
      console.error('Unable to login\n', x);
    }
  }

  async stop() {
    console.log(`[${new Date().toTimeString()}] Bot Off`);
    try {
      await this.client.destroy();
    }
    catch(x) {
      console.error(`Can't destroy client`);
    }
  }
}

module.exports = bot;
