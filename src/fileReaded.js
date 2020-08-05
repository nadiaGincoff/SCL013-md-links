const fs = require('fs');
const FileHound = require('filehound');
const colors = require('colors')
const fetch = require("fetch");
const { hostname } = require('os');
const fetchUrl = fetch.fetchUrl;

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
        console.log( route, link, `El estado del link es ${response.status} OK!`.green);
      })
      .catch(error => {
        console.log(`${route} ${error}`,` Fail 404`.red);
      });
  });
}

const stats = (links, route) => {
  let promises = promiseArrangement(links);

  // promise.allsettled espera a que se terminen de ejecutar todas las promesas dadas y ahi es cuando llama al resolve con un array que contiene los datos del resultado de esas operaciones
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  Promise.allSettled(promises)
    .then(urlResponses => {
      console.log(`===========================================================`.rainbow)
      console.log(`                                                                   `)
      console.log(` Hemos analizado los links de ${route}`)
      console.log(`                                                                   `)

      let totalLinks = urlResponses.length
      let uniqueLink = getUniqueLinks(urlResponses);

      const stats = {
        LinksTotales: totalLinks,
        LinksUnicos: uniqueLink
      }

      console.log(' Links analizados en el archivo:')
      console.table(stats)
      console.log(`                                                                   `)
      console.log(`===========================================================`.rainbow)
  })
}

const statsAndValidate = (links, route) => {
  let promises = promiseArrangement(links);

  Promise.allSettled(promises)
    .then(urlResponses => {

      console.log("FILE ===>", route)

      let totalLinks = urlResponses.length
      let uniqueLink = getUniqueLinks(urlResponses);
      let fulfilledLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'fulfilled').length
      let rejectedLinksCount = urlResponses.filter(urlResponse => urlResponse.status === 'rejected').length

      console.log('== LINKS READED == ')
      console.log('TOTAL ===>', totalLinks)
      console.log("UNIQUE ====>", uniqueLink)
      console.log("Links Buenos ====>", fulfilledLinksCount)
      console.log("BAD ====>", rejectedLinksCount)
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
  //statsAndValidate
}
