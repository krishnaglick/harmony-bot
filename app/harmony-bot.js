
const discord = require('discord.js');
const _ = require('lodash');

class bot {
  constructor(secret, mongoose) {
    this.client = new discord.Client();
    this.secret = secret;
    if(mongoose) {
      this.mongoose = mongoose;
      const userTrackerSchema = new this.mongoose.Schema({
        id: String,
        username: String
      });
      const welcomeMessageSchema = new this.mongoose.Schema({
        username: String,
        message: String
      });
      this.user = this.mongoose.model('user', userTrackerSchema);
      this.welcomeMessage = this.mongoose.model('welcomeMessage', welcomeMessageSchema);
    }
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
