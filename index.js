#!/usr/bin/env node
'use strict';
const colors = require('colors')
const path = require('path');
const { readFile, readDirectoryFiles, checkStatusCode, stadistics } = require('./src/fileReaded');
const { promises } = require('fs');
const { resolve } = require('path');

const mdLinks = (route) => {
  console.log("veamos se entra")
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
        console.log(files)
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
  getLinksFromFiles(route)
  .then(allLinks=>{
    stadistics(allLinks)
    .then(resultsAllLinks =>{
      console.log("resultsAllLinks", resultsAllLinks)
    })
    .catch(error =>{
      console.log("statistics error", error)
    })
  })
  .catch(error=>{
    console.log("Veamos", error)
  }); 
}

const getLinksFromFiles = (route) => {
  return new Promise((resolve, reject) => {
    const getLinksFromFilesPromeses = [];
    let searchMd = '.md'
    let indexFile = route.includes(searchMd)
    if (indexFile != false) {
      getLinksFromFilesPromeses.push(new Promise((resolve, reject) => {
        readFile(route, 'utf-8')
          .then(links => {
            resolve(links)
            console.log(links) 
          })
          .catch(error => {
            reject(error)
          });
      }));
    } else {
      readDirectoryFiles(route, "utf-8")
        .then(files => {
          files.forEach(filePath => {
            getLinksFromFilesPromeses.push(new Promise((resolve, reject) => {
              readFile(filePath)
                .then(links => {
                  resolve(links);
                })
                .catch(error => {
                  reject(error);
                });
            }));
          }); // end For
        })
        .catch(error => console.log(error))
    }
    Promise.all(getLinksFromFilesPromeses)
      .then(allLinks => {
        resolve(allLinks);
      })
      .catch(error => {
        reject(error);
      });
  });

}



// const fileLinkStatusAt = (route) => {
//   let searchMd = '.md'
//   let indexFile = route.includes(searchMd)
//   if (indexFile != false) {
//     readFile(route, 'utf-8')
//     .then(response => {
//       stats(response)
//     })
//     .catch(error => {
//       console.log(`no se pudo validar ${error} :c`)
//     })
//   } else {
//     readDirectoryFiles(route, "utf-8")
//     .then(files => {
//       files.forEach(filePath => {
//         readFile(filePath)
//           .then(links => {
//             console.log('Links encontrados'.green)
//             stats(links)
//           })
//           .catch(error => {
//             console.log(error)
//           })
//       })
//     })
//     .catch(error =>  console.log(error))
//   }
// }
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
    let responseMdLinks = `${pathOfFile} ${link}`;
    return console.log(responseMdLinks)
  });
}

module.exports = {
  mdLinks,
  validateFileAt,
}

















// //entrypoint

//1 leer path y verificar si es un directorio o un archivo

//2 imprimir contenido del archivo o archivos para directorio

//3 agregar manejo de options --stats --validate por parte de la cli

//4 agregar funcion para el caso de validate que se encargue de realizar
//  una peticion http a la ruta para verificar su estado, imprimir ruta y estado
//  por ejemplo:
/*
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
 */
//5 agregar funcion para el caso de stats que verifique el estado de los links
//  e imprimia las estadisticas, por ejemplo:
//       total: 3
//       unique: 3

//6 agregar funcionque para elcaso de validate YYYY stats, devuelva los stats
//  con los links broken, por ejemplo"
         // Total: 3
         // Unique: 3
         // Broken: 1
