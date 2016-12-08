
const fs = require('fs');
const path = require('path');
const firebase = require('firebase');
const fbStore = firebase.initializeApp({
  apiKey: "AIzaSyCavaaJCMRP8TVgMLfui5PHK79bGDMjnoU",
  authDomain: "harmony-bot-503fb.firebaseapp.com",
  databaseURL: "https://harmony-bot-503fb.firebaseio.com",
  storageBucket: "harmony-bot-503fb.appspot.com",
  messagingSenderId: "431219249221"
});
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
(async () => {
  try {
    await mongoose.connect(`mongodb://mongo:27017`);
  }
  catch(x) {
    console.error(`Mongoose can't connect\n`, x);
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
let client = new harmonyBot(fbStore, clientSecret, mongoose);
client.start();

if(process.env.NODE_ENV !== 'production') {
  fs.watch('./app', { persistent: true, recursive: true }, async (eventType, fileName) => {
    try {
      await client.stop();
      delete require.cache[path.resolve(fileName)];
      const harmonyBot = require('./app/harmony-bot');
      client = new harmonyBot(fbStore, clientSecret, mongoose);
      await client.start();
    }
    catch(x) {
      console.error(x);
    }
  });
}
