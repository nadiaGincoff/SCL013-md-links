
const { findLinksInTheFile, validateFileAt, fileLinkStatusAt, validateStatsForFileAt } = require('./index.js')

const mdLinks = (route, argv) => {

  if (argv._[0] === route) {
    let hasArguments = process.argv.length > 3
    if (!hasArguments) {
      console.log(`▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲`.rainbow)
      console.log(`                                                                   `)
      console.log(` Hemos analizado ${route}, los links encontrados son los siguientes:`.yellow)
      console.log(`                                                                   `)
      findLinksInTheFile(route)
    } else if ((argv.validate || argv.v) && (argv.stats || argv.s)) {
      validateStatsForFileAt(route)
    } else if (argv.validate || argv.v) {
      console.log(`▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲`.rainbow)
      console.log(` VALIDACION DE LINKS`.yellow)
      console.log(` Hemos analizado el archivo ${route}, los links analizados son los siguientes:`)
      console.log(`                                                                   `)
      validateFileAt(route)
      console.log(`                                                                   `)
    } else if (argv.stats || argv.s) {
      fileLinkStatusAt(route)
    } else {
      console.log(argv)
    }
  }
}

module.exports = {
   mdLinks
}
