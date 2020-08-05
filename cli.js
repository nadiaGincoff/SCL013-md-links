const { argv } = require('yargs');
const { mdLinks, validateFileAt, fileLinkStatusAt } = require('./index.js')

const route = process.argv[2]

if (argv._[0] === route) {
  let hasArguments = process.argv.length > 3
  if (!hasArguments) {
    mdLinks(route)
  } else if ((argv.validate || argv.v) && (argv.stats || argv.s)) {
    console.log('validando y stats')
    // validateStatsForFileAt(route)
  } else if (argv.validate || argv.v) {
    validateFileAt(route)
  } else if (argv.stats || argv.s) {
    console.log('stats')
    fileLinkStatusAt(route)
  } else {
    console.log(argv)
  }
}
