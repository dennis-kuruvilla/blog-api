
const dbConnection = async () =>{
  // get the client
  const mysql = require('mysql2/promise');
  // create the connection
  const connection = await mysql.createConnection({host:'104.198.19.69', user: 'root', password: 'root', database: 'blogDB'});
  console.log("connected to DB")
  return connection
}

module.exports={dbConnection}