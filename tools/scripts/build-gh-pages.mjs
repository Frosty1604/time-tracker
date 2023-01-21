#!/usr/bin/env zx

import * as fs from "fs";
import path from "path";

const pathToIndex = 'dist/apps/time-tracker'

await fs.cp(path.join(`${pathToIndex}`, 'index.html') , path.join(`${pathToIndex}`, '404.html'), {force: true, errorOnExist: false},err => {
  console.error(err)
})
