#Setup
FROM node:7.2.1

# Define working directory
WORKDIR /harmony-bot
ADD ./ /harmony-bot

# Install Dependencies
RUN npm i -g pm2
RUN npm i -g yarn
RUN yarn

CMD ["npm", "run", "prod"]
