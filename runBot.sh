#!/bin/bash
ssh 107.170.78.145 -l root << 'ENDSSH'
cd ~/harmony-bot
git reset --hard
git pull origin-ssh master
yarn
docker ps -a | awk '{ print $1,$2 }' | grep harmonybot_harmony | awk '{print $1 }' | xargs -I {} docker rm {} -f
docker-compose up -d --build
ENDSSH