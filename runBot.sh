#!/bin/bash
ssh 107.170.78.145 -l root << 'ENDSSH'
cd ~/harmony-bot
git pull origin-ssh master
yarn
ts="$(date +%Y-%m-%d-%m-%s)"
docker build -t harmony-bot:$ts .
docker kill harmony-bot
docker rm harmony-bot
docker run -d --name harmony-bot harmony-bot:$ts
ENDSSH