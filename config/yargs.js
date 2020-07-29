const argv = require('yargs')
  .command('validate', 'Validate files', {
    validate: {
        alias: 'v'
    }
  })
  .command('stats', 'Validate files', {
    validate: {
        alias: 'v'
    }
  })
  .help()
  .argv;

console.log(argv)

module.exports = {
  argv
}
