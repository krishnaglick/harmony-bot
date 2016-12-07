
const fs = require('fs');
const path = require('path');
const appDir = path.resolve('./app');
const firebase = require('firebase');
const fbStore = firebase.initializeApp({
  apiKey: "AIzaSyCavaaJCMRP8TVgMLfui5PHK79bGDMjnoU",
  authDomain: "harmony-bot-503fb.firebaseapp.com",
  databaseURL: "https://harmony-bot-503fb.firebaseio.com",
  storageBucket: "harmony-bot-503fb.appspot.com",
  messagingSenderId: "431219249221"
});

let client;

(async () => {
  const app = require('./app/app');
  client = await app.init();
  await app.start(client, fbStore);
})();

if(process.env.NODE_ENV !== 'production') {
  fs.watch('./app', { persistent: true, recursive: true }, async (eventType, fileName) => {
    if(fileName !== 'config.json')
      delete require.cache[`${appDir}/${fileName}`];
    try {
      const app = require('./app/app');
      await app.stop(client);
      client = await app.init();
      await app.start(client, fbStore);
    }
    catch(x) {
      console.error(x);
    }
  });
}
