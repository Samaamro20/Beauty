const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const requestModule = require('./search');

const homeHandler = (request, response) => {
  const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
  fs.readFile(htmlPath, (error, file) => {
    if (error) {
      notFoundHandler(request, response);
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(file);
  });
};

const publicHandler = (request, response) => {
  const extention = request.url.split('.')[1];
  const ContentTypeMapping = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/js',
    jpg: 'image/jpg',
    png: 'image/png',
    ico: 'image/x-ico',
  };

  if (ContentTypeMapping[extention] === undefined) {
    notFoundHandler(request, response);
    return;
  }

  const filePath = path.join(__dirname, '..', 'public', request.url);
  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end('<h1>Sorry, There is an error!</h1>');
      return;
    }
    response.writeHead(200, { 'Content-Type': ContentTypeMapping[extention] });
    response.end(file);
  });
};
const searchHandler = (request, response) => {
  const value = request.url.split('/')[2];
  if (value === undefined) {
    response.writeHead(404, { 'Content-Type': 'text/plain' }); // we need to handle the error input
    response.end('error');
  } else {
    const result = requestModule(value);
    const convertedData = JSON.stringify(result);
    console.log({ result });

    console.log({ convertedData });
    // response.writeHead(200, { 'Content-Type': 'application/json' });
    // response.end(convertedData);
  }
};

const notFoundHandler = (request, response) => {
  response.writeHead(404)
  return response.end('Page not found!')
}
module.exports = { homeHandler, publicHandler, searchHandler, notFoundHandler};
