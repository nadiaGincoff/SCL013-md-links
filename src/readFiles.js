const fs = require('fs');
const FileHound = require('filehound');

const regEx = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;

// Rutas de prueba:
const rutaAbsoluta = 'C:\Users\User\Documents\laboratoria\front-end\burguer-queen'
const rutaErr = './xguuytu'
const rutaRelativa = '../src'
const path = process.argv[2]

// Encuentra archivo .md en directorio especificado
const files = FileHound.create()
  .paths(rutaRelativa)
  .ext('md')
  .find();

files.then(console.log);
console.log(files)

// Lee el archivo de una ruta especifica
const readFiles = (path, enconding) => {

  return new Promise ((resolve, reject) => {

    fs.readFile(path, enconding, (err, data) => {

      if (err) {
        reject(console.log(err))
      } else {
        resolve(console.log(data))
      }
    })
    console.log('Contenido de Archivo');
  })
}

readFiles(path, "utf-8")
  .then(res => {
    console.log(res)
  })
  .catch(err => console.log(err))

// Lista los archivos de la ruta especifica
const listFiles = (path, enconding) => {
  return new Promise ((resolve, reject) => {

    fs.readdir(path, enconding, (err, data) => {

        if (err) {
          reject(console.log(err))
        } else {
          resolve(
            console.log( data)
          )
        }
    })
  })
}

listFiles('./src', "utf-8")
  .then(res => {
    console.log(res)
  })
  .catch(err => console.log(err))



// fs.readFile("README.md", "utf-8", (e, file) => {
//   if (e){
//     console.log(e);
//   } else {
//     const linkFound = file.match(regEx)
//     console.log(linkFound);
//   }
// })

// // Lista los archivos del directorio
// const file = fs.readdir('../src/', (error, file) => {

//   if (error) {
//     throw error;
//   }

//   console.log('me trae la lista de archivos', file)

//   fs.readFile('../README.md/', 'UTF-8', (error, archivo) => {
//     if (error) {
//       throw error;
//     }
//     console.log (archivo);
//   })

//   console.log('Contenido de Archivo');

// });

// // Validar que un archivo existe
// const archivo = 'README.md'
// const valideFile = fs.access( archivo, fs.constants.F_OK, (err) => {
//   if (err) {
//     console.log('El archivo no existe');
//   } else {
//     console.log('El archivo si existe');
//   }
// })

// module.exports = {
//   readFiles,
//   listFiles,
// }

