const mssql = require('mssql')
require('dotenv/config')

module.exports = {
  authors: new mssql.ConnectionPool({
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE_AUTHORS,
    server: process.env.MSSQL_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }),

  default: new mssql.ConnectionPool({
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
    server: process.env.MSSQL_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }),
}
