const fs = require('fs');
const FileHound = require('filehound');
const regEx = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;

// Lee el archivo de una ruta especifica
const readFile = (ruta) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(ruta, 'UTF-8' , (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
    // console.log('Contenido de Archivo');
  })
}

const readDirectoryFiles = (ruta) => {
  return new Promise ((resolve, reject) => {
    FileHound.create()
      .paths(ruta)
      .ext('md')
      .find()
      .then(files => {
        resolve(files)
      })
      .catch(error => `No se encontro ningun archivo </3`)
  })
}

const markdownStractor = (file) => {
  return new Promise ((resolve, reject) => {

  })
}

module.exports = {
  readFile,
  readDirectoryFiles
}


