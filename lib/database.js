const mysql = require('mysql');
const Config = require('../lib/config');

const pool = mysql.createPool({
  connectionLimit   : 40,
  host              : 'localhost',
  user              : Config.get('MySQL')['username'],
  password          : Config.get('MySQL')['password'],
  database          : 'ariot',
  multipleStatements: true
});

const saveData = (table, data, time) => {
  pool.getConnection((err, connection) => {
    if(err) {
      // YOLO
    }

    connection.query('insert into ' + table + ' set `data` = ' + connection.escape(data) + ', `miliseconds` = ' + connection.escape(time), (error, results, fields) => {
      connection.release();
      if(error) {
        // YOLO
      }
    });
  });
};

const saveImageData = (url, unixTime) => {
  pool.getConnection((err, connection) => {
    if(err) {
      // YOLO
    }

    connection.query('insert into s3 set `url` = ' + connection.escape(url) + ', `time` = ' + connection.escape(unixTime), (error, results, fields) => {
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
        sqlQuery += 'select data, miliseconds, date from ' + tableHack + ' where `date` >= ' + connection.escape(startDate) + ' and `date` <= ' + connection.escape(endDate) + ';';
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

const getXLatestPoints = (table, limit = 100) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err);
      }

      let sqlQuery = "";

      table.forEach((tableName) => {
        let tableHack = connection.escape(tableName);
        tableHack = tableHack.substring(1, tableHack.length-1);
        sqlQuery += 'select data, miliseconds, date from ' + tableHack + ' order by `date` desc limit ' + limit + ';';
      });

      console.log(sqlQuery);

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
    })
  });
};

module.exports = {
  saveData: saveData,
  saveImageData: saveImageData,
  getDataFromATable: getDataFromATable
};
