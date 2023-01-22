#!/usr/bin/env zx

import * as fs from 'fs';
import path from 'path';

const pathToPages = 'docs/';

await fs.cp(
  path.join(`${pathToPages}`, 'index.html'),
  path.join(`${pathToPages}`, '404.html'),
  { force: true, errorOnExist: false },
  (err) => {
    console.error(err);
  }
);
