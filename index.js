import fs from 'fs'
import url from 'url'
import path from 'path'
import sortObject from 'sort-object'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJsonPath = path.join(__dirname, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const sortedPackageJson = sortObject(packageJson)
fs.writeFileSync(packageJsonPath, JSON.stringify(sortedPackageJson, null, 2))

console.log('File package.json has been sorted.')
