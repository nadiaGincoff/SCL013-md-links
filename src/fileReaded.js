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
        // No funciona
        // if (files !== files) {
        //   console.log(`No se encontraron archivos .md en su directorio ${route}`)
        // }
        resolve(files)
      })
      .catch(error => {
          reject(`${error} No se encontraron archivos .md en su directorio ${route}`)
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
        resolve(false); // error controlado
      } else
        resolve(true);      
    });
  })
}

const checkStatusCode = (links, route) => {
    return new Promise ((resolve, reject) => {
    const linksValidatedPromises = [];      
    links.map(link => {
      linksValidatedPromises.push(new Promise((resolve, reject) => {
        getHttpStatus(link)
          .then( isValid => {
            resolve({
              linkValido:isValid,
              url: link                    
            });
          })
          .catch(error => {  
          reject(error);
          });

      }));    
    }); // end map
    Promise.all(linksValidatedPromises)
    .then((allResults)=>{
      resolve(allResults)
    })
    .catch((error)=>{
      reject(error)
    })
  });
}

const stadistics = (urls = []) => {
  return new Promise((resolve, reject) => {
    checkStatusCode(urls) 
      .then((allResults)=>{
        resolve(allResults);
      })
      .catch((error) => {
        reject(error)
      });
  });
}

module.exports = {
  readFile,
  readDirectoryFiles,
  checkStatusCode,
  stadistics
}
