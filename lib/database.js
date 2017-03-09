const mysql = require('mysql');
const uuid = require('uuid');

const connection = mysql.createPool({
  connectionLimit : 40,
  host            : 'localhost',
  user            : 'knowiot-ariot',
  password        : 's3cr3tp4ssw0rd',
  database        : 'ariot'
});

const saveData = (table, data, time) => {
  return new new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if(err) {
        reject(err);
      }

      const post = {'data': data, 'miliseconds': time};
      connection.query('INSERT INTO ? SET ?', table, post, (error, results, fields) => {
        connection.release();

        if(error) {
          reject(error);
        }

        resolve();
      });
    });
  });
};

exports.module = {
  saveData: saveData
};
