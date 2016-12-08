#!/bin/bash
ssh 107.170.78.145 -l root << 'ENDSSH'
cd ~/harmony-bot
git pull origin-ssh master
yarn
docker rm $(docker ps -a -q) -f
docker rmi $(docker images -q) -f
docker-compose build
docker-compose up -d
ENDSSH