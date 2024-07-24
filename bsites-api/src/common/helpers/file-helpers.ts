import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const fileFilter = (req, file, cb) => {
  const whitelist = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (!whitelist.includes(file.mimetype)) {
    cb(null, false);
    return cb(new BadRequestException('Only accept image file'));
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

export const customErrors = (errors) => {
  const result: any = errors.map((error) => {
    if (error.children.length > 0) {
      return customErrors(error.children);
    }
    return {
      property: error.property,
      message: error.constraints[Object.keys(error.constraints)[0]],
    };
  });
  return new BadRequestException(result[0].message);
};

export const subString = (text: string) => text.length > 50 ? text.match(/.{50,}?(?=\b)/)[0]: text;

export const getTitle = (text: string) => {
  const regex = /"([^"]*)"/g;
  let matches;
  const results = [];

  while ((matches = regex.exec(text)) !== null) {
    results.push(matches[1]);
  }

  return results
}

export const parsePriorityUrl = (url: string) => {
  const parts = url.split('\t');
  if(parts.length === 1) {
    return {
      url: url,
      priority: true
    }
  } else {
    return {
      url: parts[0],
      priority: parts[1] === "1"
    }
  }
}

export const getValueTitle = (text: string) => {
  const regex = /\{([^}]+)\}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match);
  }
  return matches;
}

export const getParseLinkPrompt = (text: string) => {
  const regex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match);
  }
  return matches;
}

export const parseJsonFromString = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    throw new Error(`Unable to parse json string: ${e}`);
  }
}
