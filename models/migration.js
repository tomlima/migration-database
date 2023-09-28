const mssql = require('../services/mssql')
const mysql = require('../services/mysql')
const utils = require('../services/utils')

module.exports = {
  getDataFromMssql: async requestBody => {
    const columns = await createMssqlColumnsToSelect(requestBody.columns)
    return new Promise(async (resolve, reject) => {
      mssql.connect(async err => {
        console.log(`SELECT ${columns} FROM ${requestBody.sqlServerTableName}`)
        if (err) reject('Cant connect to mssql database')
        await mssql.query(
          `SELECT ${columns} FROM ${requestBody.sqlServerTableName}`,
          (err, results) => {
            if (err) {
              reject(err)
            } else {
              resolve(results.recordsets[0])
            }
          }
        )
      })
    })
  },
  getNewDataStructure: (items, requestBody) => {
    var newItemList = []
    return new Promise((resolve, reject) => {
      try {
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
      } catch (err) {
        reject(err)
      }
    })
  },
  insertDataIntoMysql: (data, requestBody) => {
    return new Promise(async (resolve, reject) => {
      try {
        const mysqlTableName = requestBody.mysqlServerTableName
        var columns = requestBody.columns
        const columnNames = await createColumnNamesStringToInsert(columns)
        let insertString = `INSERT INTO ${mysqlTableName} ${columnNames} VALUES `
        await insertData(data, insertString)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }
}

const insertData = (data, insertString) => {
  return new Promise((resolve, reject) => {
    try {
      data.forEach(async (item, index, array) => {
        await saveData(item, insertString)
        /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
        if (Object.is(array.length - 1, index)) {
          resolve()
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

const saveData = (data, queryString) => {
  return new Promise((resolve, reject) => {
    try {
      queryString += '('
      data.forEach(async (item, index, array) => {
        // Handle string type
        if (item.columnType == 'string') {
          item.content = utils.scapeSingleQuotes(item.content)
        }
        // Handle datatime type
        if (item.columnType == 'datetime') {
          item.content = item.content.toISOString()
        }
        // Handle int type
        if (item.columnType == 'int') {
          queryString += item.content + ','
        } else if (
          item.columnType == 'string' ||
          item.columnType == 'datetime'
        ) {
          queryString += "'" + item.content + "'" + ','
        }

        /*---------------------------------------
           Check if is the last item in this loop
          ----------------------------------------- */
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
    } catch (err) {
      reject(err)
    }
  })
}

const createColumnNamesStringToInsert = columns => {
  return new Promise((resolve, reject) => {
    try {
      let valuesString = '('
      columns.forEach((column, index, array) => {
        if (column.ColumnType !== 'image' && column.ColumnType !== 'seo') {
          valuesString += Object.values(column)[0] + ','
        }
        /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
        if (Object.is(array.length - 1, index)) {
          valuesString = valuesString.slice(0, -1)
          valuesString += ')'
          resolve(valuesString)
        }
      })
    } catch (err) {
      reject(err)
    }
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
        let columnContent = entity[columnName]
        const columnType = Object.values(column)[1]

        // Handle with slug
        if (columnName == 'save_as') {
          columnContent = /[^/]*$/.exec(columnContent)[0]
        }

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

const createMssqlColumnsToSelect = columns => {
  return new Promise((resolve, reject) => {
    let valuesString = ''
    try {
      columns.forEach((column, index, array) => {
        valuesString += Object.keys(column)[0] + ','
        /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
        if (Object.is(array.length - 1, index)) {
          valuesString = valuesString.slice(0, -1)
          resolve(valuesString)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
