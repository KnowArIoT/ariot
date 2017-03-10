const mysql = require('mysql');
const Config = require('../lib/config');

const pool = mysql.createPool({
  connectionLimit : 40,
  host            : 'localhost',
  user            : Config.get('MySQL')['username'],
  password        : Config.get('MySQL')['password'],
  database        : 'ariot'
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

const getDataFromATable = (table, startDate, endDate) => {

};

module.exports = {
  saveData: saveData
};
