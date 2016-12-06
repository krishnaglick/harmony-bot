
const fs = require('fs');
const path = require('path');
const appDir = path.resolve('./app');

let client;

(async () => {
  const app = require('./app/app');
  client = await app.init();
  await app.start(client);
})();

fs.watch('./app', { persistent: true, recursive: true }, async (eventType, fileName) => {
  if(fileName !== 'config.json')
    delete require.cache[`${appDir}/${fileName}`];
  try {
    const app = require('./app/app');
    await app.stop(client);
    client = await app.init();
    await app.start(client);
  }
  catch(x) {
    console.error(x);
  }
});
