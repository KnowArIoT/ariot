const mysql = require('mysql');
const Config = require('../lib/config');

const pool = mysql.createPool({
  connectionLimit   : 40,
  host              : Config.get('MySQL')['server'],
  user              : Config.get('MySQL')['username'],
  password          : Config.get('MySQL')['password'],
  database          : 'ariot',
  multipleStatements: true
});

const saveData = (table, data, time, miliseconds) => {
  pool.getConnection((err, connection) => {
    if(err) {
      // YOLO
    }

    connection.query('insert into ' + table + ' set `data` = ' + connection.escape(data) + ', `miliseconds` = ' + connection.escape(miliseconds) + ', `time` = ' + connection.escape(time), (error, results, fields) => {
      connection.release();
      if(error) {
        // YOLO
      }
    });
  });
};

const saveImageData = (url, coords, time, milliseconds) => {
  pool.getConnection((err, connection) => {
    if(err) {
      // YOLO
    }

    connection.query('insert into s3 set `url` = ' + connection.escape(url) + ', `time` = ' + connection.escape(time) + ', `coords` = ' + connection.escape(coords) + ', `milliseconds` = ' + connection.escape(milliseconds), (error, results, fields) => {
      connection.release();
      if(error) {
        // YOLO
      }
    });
  });
};

const getDataFromATable = (table, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err);
      }

      let sqlQuery = "";

      table.forEach((tableName) => {
        let tableHack = connection.escape(tableName);
        tableHack = tableHack.substring(1, tableHack.length-1);
        sqlQuery += 'select data, miliseconds, time from ' + tableHack + ' where `time` >= ' + connection.escape(startDate) + ' and `time` <= ' + connection.escape(endDate) + ';';
      });
      connection.query(sqlQuery, (error, results, fields) => {
        connection.release();
        if(error) {
          reject(err);
        }

        let sensorResult = [];
        let counter = 0;

        for(const sensor of table) {
          let sensor = table[counter];
          const data = {};
          data[sensor] = results[counter];
          sensorResult.push(data);
          counter += 1;
        }

        resolve(sensorResult);
      });
    });
  });
};

const getXLatestPoints = (sensor, limit = 1000) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err);
      }

      let sqlQuery = 'select data, miliseconds, time from ' + sensor + ' order by `time` desc limit ' + limit;

      connection.query(sqlQuery, (error, results, fields) => {
        connection.release();
        if(error) {
          reject(err);
        }

        resolve(results);
      });
    })
  });
};

const getImageData = (limit = 1) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err);
      }

      let sqlQuery = 'select data, milliseconds, time from s3 order by `time` desc limit ' + limit;

      connection.query(sqlQuery, (err, results, fields) => {
        if(err) {
          reject(err);
        }
        let query1 = results;

        sqlQuery = 'select data, milliseconds, time from gps where `time` = ' + query1[0].time;
        connection.query(sqlQuery, (err, results, fields) => {
          connection.release();
          if(err) {
            reject(err);
          }

          let storage = [];
          storage.push({"image": query1, "gps": results})
          resolve(storage);
        });
      });
    });
  });
};

module.exports = {
  saveData: saveData,
  saveImageData: saveImageData,
  getDataFromATable: getDataFromATable,
  getXLatestPoints: getXLatestPoints,
  getImageData: getImageData
};
