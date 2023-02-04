#!/usr/bin/env zx
import 'zx/globals';

const pathToPages = 'docs/';

await fs.cp(
  path.join(`${pathToPages}`, 'index.html'),
  path.join(`${pathToPages}`, '404.html'),
  { force: true, errorOnExist: false },
  (err) => {
    console.error(err);
  }
);
