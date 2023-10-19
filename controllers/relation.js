const relationModel = require('../models/relation')
const { performance } = require('perf_hooks')

module.exports = {
    relationPostAuthor: async (req, res) => {
	var t0 = performance.now()
	try {

	    // Getting all entities
	    const posts = await relationModel.getPosts()
	    const reviews = await relationModel.getReviews()

	    // Posts relationships
	    await relationModel.relationPostCategory(posts, 'post')
	    console.log("Finishing category relationship....")
	    
	    await relationModel.relationPostSeo(posts, 'post')
	    console.log("Finishing SEO relationship....")
	    
	    await relationModel.relationPostThumb(posts, 'post')
	    console.log("Finishing thumb relationship....")
	    
	    await relationModel.relationPostBanner(posts, 'post')
	    console.log("Finishing banner relationship....")
	    
	    await relationModel.relationPostAuthor(posts, 'post')
	    console.log("Finishing autor relationship....")
	    
	    // Reviews relationships
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
