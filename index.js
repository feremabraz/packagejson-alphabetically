#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
)

const sortedPackageJson = JSON.stringify(
  Object.keys(packageJson)
    .sort()
    .reduce((acc, key) => {
      acc[key] = packageJson[key]
      return acc
    }, {}),
  null,
  2,
)

writeFileSync(join(process.cwd(), 'package.json'), sortedPackageJson)

console.log('Sorted package.json')
