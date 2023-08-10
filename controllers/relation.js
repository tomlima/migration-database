const relationModel = require('../models/relation')
const { performance } = require('perf_hooks')

module.exports = {
  relationPostAuthor: async (req, res) => {
    var t0 = performance.now()
    try {
      const posts = await relationModel.getPosts()
      // const tags = await relationModel.getTags()
      //await relationModel.relationPostAuthor(posts)
      //wait relationModel.relationPostCategory(posts)
      //await relationModel.relationPostSeo(posts)
      await relationModel.relationPostThumb(posts)
      await relationModel.relationPostBanner(posts)
      // Change this method
      //await relationModel.relationPostTag(tags)
      var t1 = performance.now()
      return res.status(200).json({
        success: 1,
        data: {
          message: 'Relations done..',
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
