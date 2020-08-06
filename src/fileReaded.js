const fs = require('fs');
const FileHound = require('filehound');
const colors = require('colors')
const fetch = require("fetch");
const emojis = require('console-emojis')
const { hostname } = require('os');

const fetchUrl = fetch.fetchUrl;


const truncateTo30Characters = (text) => {
  if (text.length > 30) {
    const text40 = text.slice(0, 30);
    return text40;
  } else {
    return text;
  }
}

// Lee el archivo de una ruta especifica
const readFile = (route) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(route, 'UTF-8' , (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(extractLinks(data))
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
        if (files.length == 0) {
          reject(`No se encontraron archivos .md en su directorio ${route}`)
        }
        resolve(files)
      })
  })
}

const extractLinks = (data) => {
  const expReg = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;
  const links = data.match(expReg)
  return links
}

const getHttpStatus = (url) => {
  return new Promise((resolve, reject) => {
    fetchUrl(url, (error, meta, body) => {
      if (error) {
        reject(error)
      } else {
        resolve(meta)
      }
    });
  })
}

const checkStatusCode = (links, route) => {
  links.map(link => {
    getHttpStatus(link)
      .then(response => {
        console.log(`${truncateTo30Characters(route.grey)} ${truncateTo30Characters(link.white)}`,` Status: ${response.status} OK! ☻`.green);
      })
      .catch(error => {
        console.x(` ${truncateTo30Characters(route.grey)} ${truncateTo30Characters(error)}`,` Fail 404`.red);
      });
  });
}

const stats = (links, route) => {
  let promises = promiseArrangement(links);

  // promise.allsettled espera a que se terminen de ejecutar todas las promesas dadas y ahi es cuando llama al resolve con un array que contiene los datos del resultado de esas operaciones
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  Promise.allSettled(promises)
    .then(urlResponses => {


      let totalLinks = urlResponses.length
      let uniqueLink = getUniqueLinks(urlResponses);

      const stats = {
        Totales: totalLinks,
        Unicos: uniqueLink
      }

      console.log(`▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲`.rainbow)
      console.log(`                                                                   `)
      console.log(` ESTADÍSTICAS `.yellow)
      console.log(`                                                                   `)
      console.log(` Hemos analizado los links de ${route}`)
      console.log(`                                                                   `)
      console.log(' Estadística de los links analizados en el archivo:')
      console.table(stats)
      console.log(`                                                                   `)
      console.log(`▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲`.rainbow)
  })
}

const statsAndValidate = (links, route) => {
  let promises = promiseArrangement(links);

  Promise.allSettled(promises)
    .then(urlResponses => {

      let totalLinks = urlResponses.length
      let uniqueLink = getUniqueLinks(urlResponses);
      let fulfilledLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'fulfilled').length
      let rejectedLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'rejected').length

      const statsLinks = {
        Totales: totalLinks,
        Únicos: uniqueLink,
        Status200: fulfilledLinksCount,
        Rotos: rejectedLinksCount
      }

      console.log(`▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲`.rainbow)
      console.log(`                                                                   `)
      console.log(` VALIDACIÓN Y ESTADÍSTICAS `.yellow)
      console.log(`                                                                   `)
      console.log(` Hemos analizado los links de ${route}`)
      console.log(' Estadística de los links analizados:')
      console.log(`                                                                   `)
      console.table(statsLinks)
      console.log(`                                                                   `)
      console.log(`▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼▲`.rainbow)
    })
}

// Array de promesas generadas por getHttpStatus
const promiseArrangement = (links) => {
  let promises = [];
  links.map(link => {
    promises.push(getHttpStatus(link));
  });
  return promises;
}

const getUniqueLinks = (urlResponses) => {
  let fulfilledLinks = urlResponses.filter(urlResponse => urlResponse.status === 'fulfilled').map(object => object.value.finalUrl);
  let rejectedLinks = urlResponses.filter(urlResponse => urlResponse.status === 'rejected').map(object => object.reason.hostname);
  let newArray = fulfilledLinks.concat(rejectedLinks);
  let getUniqueLinks = newArray.filter((element, index) => newArray.indexOf(element) === index).length;
  return getUniqueLinks;
}

module.exports = {
  readFile,
  readDirectoryFiles,
  checkStatusCode,
  stats,
  statsAndValidate,
  truncateTo30Characters
}
