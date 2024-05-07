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
