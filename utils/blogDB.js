require('dotenv').config();

const dbConnection = async () =>{
  const user= process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD
  
  // get the client
  const mysql = require('mysql2/promise');
  // create the connection
  const connection = await mysql.createConnection({host:'104.198.19.69', user: user, password: password, database: 'blogDB'});
  console.log("connected to DB")
  return connection
}

module.exports={dbConnection}