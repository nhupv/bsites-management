import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const fileFilter = (req, file, cb) => {
  const whitelist = ['text/csv'];

  if (!whitelist.includes(file.mimetype)) {
    cb(null, false);
    return cb(new BadRequestException('Only accept csv files'));
  }

  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 10485760) {
    cb(null, false);
    return cb(new BadRequestException('Max file size is 10MB'));
  }
  return cb(null, true);
};

export const sleep = (ms = 1) => {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
};

export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getProxy = () => {
  const proxies = [
    'http://192.186.149.139:8800',
    'http://138.128.45.67:8800',
    'http://154.38.22.117:8800',
    'http://192.186.149.143:8800',
    'http://154.38.22.94:8800',
    'http://192.186.149.138:8800',
    'http://192.186.149.131:8800',
    'http://138.128.45.65:8800',
    'http://192.186.132.160:8800',
    'http://192.186.132.173:8800',
    'http://192.186.171.127:8800',
    'http://2.56.50.23:8800',
    'http://23.254.66.118:8800',
    'http://23.229.79.26:8800',
    'http://192.186.171.68:8800',
    'http://23.229.53.53:8800',
    'http://192.186.171.95:8800',
    'http://23.229.53.63:8800',
    'http://23.229.79.24:8800',
    'http://23.254.66.127:8800',
    'http://23.254.66.110:8800',
    'http://23.254.66.104:8800',
    'http://23.229.67.250:8800',
    'http://23.229.67.241:8800',
    'http://23.229.53.59:8800',
    'http://192.186.171.113:8800',
    'http://23.229.53.52:8800',
    'http://192.186.171.122:8800',
    'http://2.56.50.67:8800',
    'http://23.229.67.247:8800',
    'http://23.229.67.248:8800',
    'http://23.229.79.31:8800',
    'http://2.56.50.64:8800',
    'http://23.229.79.18:8800',
    'http://2.56.50.65:8800',
  ];
  const random = randomIntFromInterval(0, proxies.length - 1);
  return proxies[random];
};
export const getProxyInFile = () => {
  const pathFile = path.join(__dirname, '.proxy');
  const file = fs
    .readFileSync(pathFile, 'utf8')
    .toString()
    .replace(/\r\n/g, '\n')
    .split('\n');
  const random = randomIntFromInterval(0, file.length - 1);
  return `http://${file[random]}`;
};
export const extractHostname = (url) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};
