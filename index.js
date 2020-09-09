#!/usr/bin/env node
'use strict';
const colors = require('colors')
const path = require('path');
const { readFile, readDirectoryFiles, checkStatusCode, stats, statsAndValidate, truncateTo30Characters } = require('./src/fileReaded')

const findLinksInTheFile = (route) => {
  let searchMd = '.md'
  let indexFile = route.includes(searchMd)
  // proceso el path y veo que es
  if (indexFile != false) {
    readFile(route, "utf-8")
      .then(response => {
        commandResponse(response, route);
      })
      .catch(error => console.log(error))
  } else {
    readDirectoryFiles(route, "utf-8")
      .then(files => {
        files.forEach(filePath => {
          readFile(filePath)
            .then(links => {
               commandResponse(links, route);
            })
            .catch(error => {
              console.log(error)
            })
        })
      })
      .catch(error => console.log(error))
  }
}

const validateFileAt = (route) => {
  let searchMd = '.md'
  let indexFile = route.includes(searchMd)
  if (indexFile != false) {
    readFile(route, 'utf-8')
    .then(response => {

      checkStatusCode(response, route)
    })
    .catch(error => {
      console.log(`no se pudo validar ${error} :c`)
    })
  } else {
    readDirectoryFiles(route, "utf-8")
    .then(files => {
      files.forEach(filePath => {
        readFile(filePath)
          .then(links => {
            checkStatusCode(links, route);
          })
          .catch(error => {
            console.log(error)
          })
      })
    })
    .catch(error =>  console.log(error))
  }
}

const fileLinkStatusAt = (route) => {
  let searchMd = '.md'
  let indexFile = route.includes(searchMd)
  if (indexFile != false) {
    readFile(route, 'utf-8')
    .then(links => {
      stats(links, route)
    })
    .catch(error => {
      console.log(error)
    })

  } else {
    readDirectoryFiles(route, "utf-8")
    .then(files => {
      files.forEach(filePath => {
        readFile(filePath)
          .then(links => {
            stats(links, route)
          })
          .catch(error => {
            console.log(error)
          })
      })
    })
    .catch(error =>  console.log(error))
  }
}

const validateStatsForFileAt = (route) => {
  let searchMd = '.md'
  let indexFile = route.includes(searchMd)
  if (indexFile != false) {
    readFile(route, 'utf-8')
    .then(links => {

      statsAndValidate(links, route)
    })
    .catch(error => {
      console.log(error)
    })

  } else {
    readDirectoryFiles(route, "utf-8")
    .then(files => {
      files.forEach(filePath => {
        readFile(filePath)
          .then(links => {
            statsAndValidate(links, route)
          })
          .catch(error => {
            console.log(error)
          })
      })
    })
    .catch(error =>  console.log(error))
  }
}

// Obtengo nombre de la ruta
const filePathName = (route) => {
  let directories = path.dirname(route);
  let filename = path.basename(route);
  let pathOfFile = `${directories}/${filename}`;
  return pathOfFile;
}

const commandResponse = (links, route) => {
  links.map(link => {
    let pathOfFile = filePathName(route);
    let responseMdLinks = `${truncateTo30Characters(pathOfFile.gray)} ${truncateTo30Characters(link.white)}`;
    return console.log(responseMdLinks)
  });
}



module.exports = {
  findLinksInTheFile,
  validateFileAt,
  fileLinkStatusAt,
  validateStatsForFileAt
}
