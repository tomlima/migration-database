const relationModel = require('../models/relation')
const { performance } = require('perf_hooks')

module.exports = {
    relationPostAuthor: async (req, res) => {
	var t0 = performance.now()
	try {

	    // Getting all entities
	    const posts = await relationModel.getPosts()
	    console.log("#### Getting posts: DONE ##### \n")
	    
	    const reviews = await relationModel.getReviews()
	    console.log("#### Getting reviews: DONE #### \n")
	    
	    const tags = await relationModel.getTags()
	    console.log("#### Getting tags: DONE ##### \n")
	    
	    // Tags relationship
	    await relationModel.relationTags(tags)
	    console.log("#### Tags relationship: DONE #### \n")
	    
	    // Posts relationships
	    await relationModel.relationPostCategory(posts, 'post')
	    console.log("#### Post - category relationship: DONE #### \n")
	    
	    await relationModel.relationPostSeo(posts, 'post')
	    console.log("#### Post - SEO relationship: DONE #### \n")
	    
	    await relationModel.relationPostThumb(posts, 'post')
	    console.log("#### Post - Thumb relationship: DONE #### \n")
	    
	    await relationModel.relationPostBanner(posts, 'post')
	    console.log("#### Post- Banner relationship: DONE #### \n")
	    
	    await relationModel.relationPostAuthor(posts, 'post')
	    console.log("#### Post - Author relationship: DONE #### \n")
	    
	    // Reviews relationships
	    await relationModel.relationPostCategory(reviews, 'review')
	    console.log("#### Review - category relationship: DONE #### \n")
	    
	    await relationModel.relationPostSeo(reviews, 'review')
	    console.log("#### Review - SEO relationship: DONE #### \n")
	    
	    await relationModel.relationPostThumb(reviews, 'review')
	    console.log("#### Review - Thumb relationship: DONE #### \n")
	    
	    await relationModel.relationPostBanner(reviews, 'review')
	    console.log("#### Review - Banner relationship: DONE #### \n")
	    
	    await relationModel.relationPostAuthor(reviews, 'review')
	    console.log("#### Review - Author relationship: DONE #### \n")
	    
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
