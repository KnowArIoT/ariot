const express = require('express');
const database = require('../lib/database');
const RateLimit = require('express-rate-limit');

const router = express.Router();

const apiLimiter = new RateLimit({
  windowMs: 60*1000,
  max: 100,
  delayMs: 0,
  delayAfter: 1,
  message: "Dude... Chill out! Try again in a minute!"
});

router.get('/health', function(req, res, next) {
  res.status(200).json({'message': 'The system is up!'});
});

router.post('/save', apiLimiter, (req, res, next) => {

  const dataList = req.body;

  for(const point of dataList) {
    database.saveData(point.name, point.data, point.time);
  }
  res.status(200).end();
});

module.exports = router;
