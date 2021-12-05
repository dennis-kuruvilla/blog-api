require('dotenv').config();

const executeQuery = async (query) =>{
  const user= process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD
  
  // get the client
  const mysql = require('mysql2/promise');
  // create the connection
  const connection = await mysql.createConnection({host:'185.224.138.91', user: user, password: password, database: 'u244846814_blogDB'});
  console.log("connected to DB")
  // return connection

  const [rows] = await connection.execute(query);

  await connection.end()

  return [rows]
}

module.exports={executeQuery}