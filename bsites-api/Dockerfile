FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install glob rimraf --force

RUN npm install --force

COPY . .

RUN npm run build

