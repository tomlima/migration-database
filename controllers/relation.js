const relationModel = require('../models/relation')
const { performance } = require('perf_hooks')

module.exports = {
  relationPostAuthor: async (req, res) => {
    var t0 = performance.now()
    try {
      // const tags = await relationModel.getTags()
      const posts = await relationModel.getPosts()
      const reviews = await relationModel.getReviews()

      await relationModel.relationPostCategory(posts, 'post')
      await relationModel.relationPostSeo(posts, 'post')
      await relationModel.relationPostThumb(posts, 'post')
      await relationModel.relationPostBanner(posts, 'post')
      await relationModel.relationPostAuthor(posts, 'post')

      await relationModel.relationPostCategory(reviews, 'review')
      await relationModel.relationPostSeo(reviews, 'review')
      await relationModel.relationPostThumb(reviews, 'review')
      await relationModel.relationPostBanner(reviews, 'review')
      await relationModel.relationPostAuthor(reviews, 'review')

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
