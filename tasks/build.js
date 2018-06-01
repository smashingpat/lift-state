const path = require('path')
const execSync = require('child_process').execSync
const rimraf = require('rimraf')

console.log('\nCleaning the old files')
rimraf.sync(path.resolve(__dirname, '../es'))

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('\nBuilding ES modules ...')

exec('npx babel modules -d es --ignore __tests__', {
  BABEL_ENV: 'es'
})
