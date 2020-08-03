#!/usr/bin/env node
'use strict';

const colors = require('colors')
const argv = require('./config/yargs').argv
const path = require('path');

const route = process.argv[2]
const { readFile, readDirectoryFiles } = require('./src/fileReaded')

const mdLinks = (route) => {
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
              console.log('Links encontrados'.green)
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

mdLinks(route)
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
    let pepa = `${pathOfFile} ${link}`;
    console.log(pepa);
  });
}

// let comando = argv._[0];

// switch (comando) {

//     case 'validate':
//         console.log('soy validate')
//         break;

//     case 'stats':
//         console.log('soy stats')
//         break;

//     default:
//         console.log('Comando no reconocido');
// }


//Se utiliza la información de la posición 0 del process.argv()

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


// Accede al comando ejecutado
// let command = argv._[0]

// switch( command ) {
//   case 'validate':
//     //console.log(listarArchivosDeDirectorio(path))
//   break;
//   case 'stats':
//     console.log('stats')
//   break;
//   default:
//     console.log('Command not recognized');
