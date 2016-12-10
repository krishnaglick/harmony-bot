
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
(async () => {
  try {
    await mongoose.connect(`mongodb://mongo:27017`);
  }
  catch(x) {
    console.error(`Mongoose can't connect`);
  }
})();

let clientSecret;
try {
  clientSecret = require('./config').clientSecret;
}
catch(x) {
  clientSecret = process.env.CLIENT_SECRET;
}
if(!clientSecret)
  throw 'You need a client secret!';

const harmonyBot = require('./app/harmony-bot');
let client = new harmonyBot(clientSecret, mongoose);
client.start();

