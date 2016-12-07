ssh 107.170.78.145 -l root << 'ENDSSH'
cd ~/harmony-bot
git pull origin-ssh master
npm run prod
ENDSSH