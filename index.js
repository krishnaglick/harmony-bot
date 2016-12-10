
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
(async () => {
  let config;
  try {
    config = require('./config');
  }
  catch(x) {
    config = {};
    console.warn(`No client config, I hope you know what you're doing!`);
  }
  try {
    const mongoUrl = config.mongoUrl || 'mongo';
    await mongoose.connect(`mongodb://${mongoUrl}:27017`);
  }
  catch(x) {
    console.error(`Mongoose can't connect`);
  }
  const clientSecret = config.clientSecret || process.env.CLIENT_SECRET;
  if(!clientSecret)
    throw 'You need a client secret!';

  const harmonyBot = require('./app/harmony-bot');
  const client = new harmonyBot(clientSecret, mongoose);
  client.start();
})()
.catch(x => console.error('No config file!\n', x));

