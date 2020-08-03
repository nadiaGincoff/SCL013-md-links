const fs = require('fs');
const FileHound = require('filehound');
const fetch = require("fetch");
const fetchUrl = fetch.fetchUrl;

const linksObtenidos = []
// Lee el archivo de una ruta especifica
const readFile = (route, options) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(route, 'UTF-8' , (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(extractLinks(data, options))
      }
    })
  })
}

const readDirectoryFiles = (route) => {
  return new Promise ((resolve, reject) => {
    FileHound.create()
      .paths(route)
      .ext('md')
      .find()
      .then(files => {
        resolve(files)
      })
      .catch(error => reject(`No se encontro ningun archivo </3 ${error}`))
  })
}

const extractLinks = (string, options) => {

  const expReg = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;
  const links = string.match(expReg)

  // links.forEach(link => {
  //   linksObtenidos.push(link)
  //   //console.log('somos los links obtenidos', linksObtenidos)
  // })

  // checkStatusCode(links);
  return links
}

const getHttpStatus = (url) => {
  return new Promise((resolve, reject) => {
    fetchUrl(url, (error, meta, body) => {
      if (error) {
        reject(error)
      } else {
        resolve(meta.status)
      }
    });
  })
}

const checkStatusCode = (links) => {
  links.map(link => {
    getHttpStatus(link)
      .then(response => {
        console.log('El estado de ', link, 'es: ', response, links.length);
      })
      .catch(error => {
        console.log(`Fail 404 ${error}`, errores);
      });
  });
}

module.exports = {
  readFile,
  readDirectoryFiles
}
