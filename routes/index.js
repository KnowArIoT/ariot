const express = require('express');
const database = require('../lib/database');
const RateLimit = require('express-rate-limit');

const router = express.Router();

const apiLimiter = new RateLimit({
  windowMs: 1000,
  max: 100,
  delayMs: 0,
  delayAfter: 1,
  message: "Dude... Chill out! Try again in a minute!"
});

router.get('/', function(req, res, next) {
  res.status(200).json({'message': 'The system is up!'});
});

router.post('/save', apiLimiter, (req, res, next) => {

  const dataList = JSON.parse(req.body);

  dataList.forEach((point) => {
    database.saveData(point.name, point.data, point.time).then(() => {
      res.status(200).end();
    }).catch((err) => {
      res.status(400).end(err);
    });
  });
});

module.exports = router;
