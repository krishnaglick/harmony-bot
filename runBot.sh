#!/bin/bash
ssh 107.170.78.145 -l root << 'ENDSSH'
cd ~/harmony-bot
git pull origin-ssh master
yarn
docker-compose up -d --build
ENDSSH