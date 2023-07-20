const migrationModel = require('../models/migration')

module.exports = {
  migrate: async (req, res) => {
    try {
      const t1 = performance.now()
      const entities = await migrationModel.getDataFromMssql(req.body)
      const convertedEntities = await migrationModel.getNewDataStructure(
        entities,
        req.body
      )
      await migrationModel.insertDataIntoMysql(convertedEntities, req.body)
      const t2 = performance.now()

      return res.status(200).json({
        success: 1,
        data: {
          message: 'Done..',
          'Execution time': Math.trunc(t2 - t1) + ' milliseconds.'
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
