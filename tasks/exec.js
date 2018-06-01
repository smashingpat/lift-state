const execSync = require('child_process').execSync


module.exports = (command, extraEnv) =>
    execSync(command, {
        stdio: 'inherit',
        env: Object.assign({}, process.env, extraEnv)
    });
