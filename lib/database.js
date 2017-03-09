const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 40,
  host            : 'localhost',
  user            : 'knowiot-ariot',
  password        : 's3cr3tp4ssw0rd',
  database        : 'ariot'
});

const saveData = (table, data, time) => {
  console.log(`${table} - ${data} - ${time}`);

  pool.getConnection((err, connection) => {
    if(err) {
      console.log("error");
      throw err;
    }

    connection.query('insert into ' + table + ' set `data` = ' + connection.escape(data) + ', `miliseconds` = ' + connection.escape(time), (error, results, fields) => {
      connection.release();

      if(error) {
        throw error;
      }
    });
  });
};

module.exports = {
  saveData: saveData
};
