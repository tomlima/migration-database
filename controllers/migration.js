const migrationModel = require('../models/migration')
const { performance } = require('perf_hooks')

module.exports = {
  migrate: async (req, res) => {
    var t0 = performance.now()
    try {
      const entities = await migrationModel.getDataFromMssql(req.body)
      const convertedEntities = await migrationModel.getNewDataStructure(
        entities,
        req.body
      )
      await migrationModel.insertDataIntoMysql(convertedEntities, req.body)
      var t1 = performance.now()
      return res.status(200).json({
        success: 1,
        data: {
          message: 'Done..',
          time: `Execution time: ${((t1 - t0) / 1000).toFixed(2)} sec`
        }
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: 0,
        message: err
      })
    }
  }
}
