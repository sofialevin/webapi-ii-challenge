const express = require('express');
const router = express.Router();

const db = require('../data/db');

router.get('/', (req, res) => {
    res.status(200).send('hello from the GET /posts endpoint');
  });

  module.exports = router;