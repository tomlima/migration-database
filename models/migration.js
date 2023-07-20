const { columns } = require('mssql')
const mssql = require('../services/mssql')
const mysql = require('../services/mysql')

module.exports = {
  getDataFromMssql: requestBody => {
    return new Promise((resolve, reject) => {
      mssql.connect(async err => {
        if (err) reject('Cant connect to mssql database')
        await mssql.query(
          `SELECT TOP 30 * FROM ${requestBody.sqlServerTableName}`,
          (err, results) => {
            if (err) reject(err)
            resolve(results.recordsets[0])
          }
        )
      })
    })
  },
  getNewDataStructure: (items, requestBody) => {
    var newItemList = []
    return new Promise((resolve, reject) => {
      items.forEach(async (item, index, array) => {
        const newItem = await createNewEntityStructure(item, requestBody)
        newItemList.push(newItem)

        /*---------------------------------------
         Check if is the last item in this loop
        -----------------------------------------*/
        if (Object.is(array.length - 1, index)) {
          resolve(newItemList)
        }
      })
    })
  },
  insertDataIntoMysql: (data, requestBody) => {
    return new Promise(async (resolve, reject) => {
      const mysqlTableName = requestBody.mysqlServerTableName
      var columns = requestBody.columns
      const columnNames = await createColumnNamesStringToInsert(columns)
      let insertString = `INSERT INTO ${mysqlTableName} ${columnNames} VALUES `
      const valuesNames = await insertData(data, insertString)
      resolve(valuesNames)
    })
  }
}

const insertData = (data, insertString) => {
  return new Promise((resolve, reject) => {
    data.forEach(async (item, index, array) => {
      const result = await saveData(item, insertString)
      /*---------------------------------------
         Check if is the last item in this loop
        -----------------------------------------*/
      if (Object.is(array.length - 1, index)) {
        resolve(result)
      }
    })
  })
}

const saveData = (data, queryString) => {
  return new Promise((resolve, reject) => {
    queryString += '('
    data.forEach((item, index, array) => {
      if (item.columnType == 'int') {
        queryString += item.content + ','
      } else {
        queryString += "'" + item.content + "'" + ','
      }
      /*---------------------------------------
         Check if is the last item in this loop
        -----------------------------------------*/
      if (Object.is(array.length - 1, index)) {
        queryString = queryString.slice(0, -1)
        queryString += ')'
        mysql.query(queryString, (err, results) => {
          if (err) {
            reject(err)
          }
          resolve(results)
        })
      }
    })
  })
}

const createColumnNamesStringToInsert = columns => {
  return new Promise((resolve, reject) => {
    let valuesString = '('
    columns.forEach((column, index, array) => {
      valuesString += Object.values(column)[0] + ','
      /*---------------------------------------
         Check if is the last item in this loop
        -----------------------------------------*/
      if (Object.is(array.length - 1, index)) {
        valuesString = valuesString.slice(0, -1)
        valuesString += ')'
        resolve(valuesString)
      }
    })
  })
}

const createNewEntityStructure = (entity, requestBody) => {
  var columns = requestBody.columns
  const resultArray = []

  return new Promise((resolve, reject) => {
    try {
      columns.forEach((column, index, array) => {
        const columnName = Object.keys(column)[0]
        const columnValue = Object.values(column)[0]
        const columnContent = entity[columnName]
        const columnType = Object.values(column)[1]
        resultArray.push({
          column: columnValue,
          content: columnContent,
          columnType: columnType
        })
        /*---------------------------------------
         Check if is the last item in this loop
        -----------------------------------------*/
        if (Object.is(array.length - 1, index)) {
          resolve(resultArray)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
