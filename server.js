const express = require('express');

const postsRouter = require('./posts/postsRouter.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send(`
      <h2>Sofia's API</h>
      <p>Welcome to my API</p>
    `);
});

module.exports = server;