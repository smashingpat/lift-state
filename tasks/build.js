const path = require('path')
const exec = require('./exec')
const rimraf = require('rimraf')

console.log('\nCleaning the old files')
rimraf.sync(path.resolve(__dirname, '../es'))

console.log('\nBuilding CommonJS modules ...')
exec('npx babel modules -d lib', {
    BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES modules ...')
exec('npx babel modules -d es', {
    BABEL_ENV: 'es'
})
