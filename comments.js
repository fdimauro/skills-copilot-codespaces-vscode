// Create web server
// Create HTTP request
// Create HTTP response
// Send HTTP response
// Listen for incoming requests
// Parse incoming requests
// Read from the database
// Write to the database
// Respond to the request

const http = require('http');
const fs = require('fs');
const url = require('url');
const comments = require('./comments');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const query = reqUrl.query;

  switch (path) {
    case '/comments':
      if (req.method === 'GET') {
        comments.getComments((err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end('Server error');
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          }
        });
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const { comment } = JSON.parse(body);
          comments.postComment(comment, (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.end('Server error');
            } else {
              res.statusCode = 201;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            }
          });
        });
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
      break;
    default:
      res.statusCode = 404;
      res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});