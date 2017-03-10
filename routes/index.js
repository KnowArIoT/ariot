const express = require('express');
const database = require('../lib/database');
const RateLimit = require('express-rate-limit');

const router = express.Router();

const postApiLimiter = new RateLimit({
  windowMs: 60*1000,
  max: 100,
  delayMs: 0,
  delayAfter: 1,
  message: "Dude... Chill out! Try again in a minute!"
});

const getApiLimiter = new RateLimit({
  windowMs: 60*1000,
  max: 20,
  delayMs: 0,
  delayAfter: 1,
  message: "Dude... Chill out! Try again in a minute!"
});

// TODO: Input validation

router.get('/', (req, res, next) => {
    res.status(200).json({'image': 'https://cdn.meme.am/cache/instances/folder620/500x/73490620.jpg'})
});

router.get('/health', (req, res, next) => {
  res.status(200).json({'message': 'The system is up!'});
});

router.get('/data', getApiLimiter, (req, res, next) => {

  const sensors = req.body.sensors;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  database.getDataFromATable(sensors, startDate, endDate).then((results) => {
    res.status(200).json(results);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/save', postApiLimiter, (req, res, next) => {

  const dataList = req.body;

  for(const point of dataList) {
    database.saveData(point.name, point.data, point.time);
  }
  res.status(200).end();
});

router.post('/s3', postApiLimiter, (req, res, next) => {
  const url = req.body.url;
  const time = req.body.time;

  database.saveImageData(url, time);

  res.status(200).end();
});

module.exports = router;
