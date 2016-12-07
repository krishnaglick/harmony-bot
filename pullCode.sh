ssh 107.170.78.145 -l root << 'ENDSSH'
cd ~/harmony-bot
git pull origin-ssh master
nvm install 7.2.0
nvm use 7.2.0
npm i -g pm2 yarn
yarn
npm run prod
ENDSSH