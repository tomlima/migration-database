const mssql = require('../services/mssql')
const mysql = require('../services/mysql')
const utils = require('../services/utils')

module.exports = {
	/*-------------------------------------
	Relationship between posts and authors
	-------------------------------------*/
	relationPostAuthor: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				posts.forEach(async (post, index, array) => {
					if (post.CodMateria !== null && post.CodAutor !== null) {
						if (postType == 'post') {
							queryString =
								`INSERT INTO posts_author_links
                                   (post_id,author_id)
                                 VALUES 
                                   (${post.CodMateria}, ${post.CodAutor})`
						} else {
							queryString =
								`INSERT INTO reviews_author_links
                                   (review_id,author_id)
                                 VALUE
                                   (${post.CodMateria}, ${post.CodAutor})`
						}
						const result = await saveData(queryString)
						if (result) {
							count++
						}

						if (!result) {
							errorCount++
							console.log(`${queryString}\n`)
						}
					}
					/*---------------------------------------f
					Check if is the last item in this loop
					-----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Authors relationship data count: ${count} \n `)
						console.log(`Authors relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*---------------------------------------
	Relationship between posts and categories
	----------------------------------------*/
	relationPostCategory: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				posts.forEach(async (post, index, array) => {
					if (post.CodTag !== null) {
						let queryString
						if (postType == 'post') {
							queryString =
								`INSERT INTO posts_category_links
                                   (post_id,category_id)
                                 VALUES 
                                   (${post.CodMateria}, ${post.CodTag})`
						} else {
							queryString =
								`INSERT INTO reviews_category_links
                                   (review_id,category_id) 
                                 VALUES 
                                   (${post.CodMateria}, ${post.CodTag})`
						}
						const result = await saveData(queryString)

						if (result) {
							count++
						}

						if (!result) {
							errorCount++
							console.log(`${queryString}\n`)
						}
					}
					/*---------------------------------------
					  Check if is the last item in this loop
					  -----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Categories relationship data count: ${count} \n`)
						console.log(`Categories relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},

	/*---------------------------------------
	Relationship between posts and tags
	----------------------------------------*/
	relationTags: (tags) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				tags.forEach(async (tag, index, array) => {
					if (tag.CodMateria !== null && tag.Idf_Tag !== null) {
						let queryString
						let postType = parseInt(tag.CodTipoMateria)

						if (postType !== 45) {
							queryString =
								`INSERT INTO posts_tags_links
                                   (post_id,tag_id) 
                                 VALUES 
                                   (${tag.CodMateria}, ${tag.Idf_Tag})`
						} else {
							queryString =
								`INSERT INTO reviews_tag_links
                                   (review_id,tag_id) 
                                 VALUES 
                                   (${tag.CodMateria}, ${tag.Idf_Tag})`
						}
						const result = await saveData(queryString)

						if (result) {
							count++
						}

						if (!result) {
							errorCount++
							console.log(`${queryString}\n`)
						}
					}
					/*---------------------------------------
					  Check if is the last item in this loop
					  -----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Tags relationship data count: ${count} \n `)
						console.log(`Tags relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*-------------------------------------------
	Relationship between posts and SEO components
	--------------------------------------------*/
	relationPostSeo: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				posts.forEach(async (post, index, array) => {
					// Save component
					const metaDescription = utils.scapeSingleQuotes(post.descricaoSEO)
					const canonical = utils.scapeSingleQuotes(post.UrlCanonical)
					const keyWords = utils.scapeSingleQuotes(post.palavra_chave)

					const queryStringSeoComponent =
						`INSERT INTO components_seo_seos
                             (meta_description,canonical_url,key_words)
                           VALUES 
                             ('${metaDescription}', '${canonical}', '${keyWords}')`

					//Save SEO component
					const componentId = await saveData(queryStringSeoComponent)

					// Save relation
					let queryStringRelationSeo
					if (postType == 'post') {
						queryStringRelationSeo =
							`INSERT INTO posts_components
                               (entity_id,component_id,component_type,field)
                             VALUES 
                               (${post.CodMateria}, ${componentId}, 'seo.seo','Seo')`
					} else {
						queryStringRelationSeo =
							`INSERT INTO reviews_components
                               (entity_id,component_id,component_type,field)
                             VALUES 
                               (${post.CodMateria}, ${componentId}, 'seo.seo','Seo')`
					}
					const result = await saveData(queryStringRelationSeo)

					if (result) {
						count++
					}

					if (!result) {
						errorCount++
					}
					/*---------------------------------------
					  Check if is the last item in this loop
					-----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`SEO relationship data count: ${count} \n `)
						console.log(`SEO relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*---------------------------------------
	Relationship between posts and thumb
	----------------------------------------*/
	relationPostThumb: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				posts.forEach(async (post, index, array) => {
					// Save file
					let thumbUrl = 'https://tm.ibxk.com.br/' + post.pathImagem + '.jpg'
					let thumbName = 'thumb-image-' + new Date().toISOString()

					let queryStringFileTable =
						`INSERT INTO files
                           (name,width,height,hash,ext,mime,size,url,preview_url,provider,folder_path)
                         VALUES 
                           ('${thumbName}', 500, 500, '${thumbName}','.webp','image/webp',50,'${thumbUrl}','${thumbUrl}','local','/')`
					//Save file
					let fileId = await saveData(queryStringFileTable)

					// Save relation
					let queryStringRelationFile
					if (postType == 'post') {
						queryStringRelationFile =
							`INSERT INTO files_related_morphs
                               (file_id,related_id,related_type,field)
                             VALUES 
                               (${fileId}, ${post.CodMateria}, 'api::post.post','thumb')`
					} else {
						queryStringRelationFile =
							`INSERT INTO files_related_morphs
                               (file_id,related_id,related_type,field)
                             VALUES 
                               (${fileId}, ${post.CodMateria}, 'api::review.review','thumb')`
					}
					const result = await saveData(queryStringRelationFile)
					if (result) {
						count++
					}

					if (!result) {
						errorCount++
					}
					/*---------------------------------------
					  Check if is the last item in this loop
					-----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Thumb relationship data count: ${count} \n `)
						console.log(`Thumb relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*---------------------------------------
	Relationship between posts and banner
	----------------------------------------*/
	relationPostBanner: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				posts.forEach(async (post, index, array) => {
					// Save file
					let bannerUrl = 'https://mega.ibxk.com.br' + post.superImagem
					let bannerName = 'banner-image-' + new Date().toISOString()

					let queryStringFileTable =
						`INSERT INTO files
                           (name,width,height,hash,ext,mime,size,url,preview_url,provider,folder_path)
                         VALUES 
                           ('${bannerName}', 500, 500, '${bannerName}','.webp','image/webp',50,'${bannerUrl}','${bannerUrl}','local','/')`
					let fileId = await saveData(queryStringFileTable)
					// Save relation
					let queryStringRelationFile
					if (postType == 'post') {
						queryStringRelationFile =
							`INSERT INTO files_related_morphs
                               (file_id,related_id,related_type,field)
                             VALUES 
                               (${fileId}, ${post.CodMateria}, 'api::post.post','banner')`
					} else {
						queryStringRelationFile =
							`INSERT INTO files_related_morphs
                               (file_id,related_id,related_type,field)
                             VALUES 
                               (${fileId}, ${post.CodMateria}, 'api::review.review','banner')`
					}
					const result = await saveData(queryStringRelationFile)

					if (result) {
						count++
					}

					if (!result) {
						errorCount++
					}
					/*---------------------------------------
					  Check if is the last item in this loop
					 -----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Banner relationship data count: ${count} \n `)
						console.log(`Banner relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*-------------------------------------------
	Relationship between posts and Source_Text components
	--------------------------------------------*/
	relationPostSourceText: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;
				let errorLengthSource = 0;

				posts.forEach(async (post, index, array) => {
					const fonteTexto = post.fonteTexto ? post.fonteTexto.split("£") : '';
					const fonteLink = post.fonteLink ? post.fonteLink.split("£") : '';
					if (fonteTexto.length === fonteLink.length) {
						for (let index = 0; index < fonteTexto.length; index++) {
							// Realize a operação desejada com cada item
							const name = utils.scapeSingleQuotes(fonteTexto[index])
							const url = utils.scapeSingleQuotes(fonteLink[index])

							const queryStringSourceComponent =
								`INSERT INTO components_post_sources
										(name,url)
										VALUES 
										('${name}', '${url}')`

							//Save Source component
							const componentId = await saveData(queryStringSourceComponent)

							// Save relation
							let queryStringRelationSource
							if (postType == 'post') {
								queryStringRelationSource =
									`INSERT INTO posts_components
									(entity_id,component_id,component_type,field)
									VALUES 
									(${post.CodMateria}, ${componentId}, 'post.source','source_text')`
							} else {
								queryStringRelationSource =
									`INSERT INTO reviews_components
									(entity_id,component_id,component_type,field)
									VALUES 
									(${post.CodMateria}, ${componentId}, 'post.source','source_text')`
							}
							const result = await saveData(queryStringRelationSource)

							if (result) {
								count++
							}

							if (!result) {
								errorCount++
							}
						}
					} else {
						errorLengthSource++
					}
					// /*---------------------------------------
					//   Check if is the last item in this loop
					// -----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Source_Text relationship data count: ${count} \n `)
						console.log(`Source_Text relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*-------------------------------------------
	Relationship between posts and Source_Text components
	--------------------------------------------*/
	relationPostSourceImage: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;
				let errorLengthSource = 0;

				posts.forEach(async (post, index, array) => {
					const fonteImagem = post.fonteImagem ? post.fonteImagem.split("£") : '';
					const linkFonteImagem = post.linkFonteImagem ? post.linkFonteImagem.split("£") : '';
					if (fonteImagem.length === linkFonteImagem.length) {
						for (let index = 0; index < fonteImagem.length; index++) {
							// Realize a operação desejada com cada item
							const name = utils.scapeSingleQuotes(fonteImagem[index])
							const url = utils.scapeSingleQuotes(linkFonteImagem[index])

							const queryStringSourceComponent =
								`INSERT INTO components_post_sources
									(name,url)
									VALUES 
									('${name}', '${url}')`

							//Save Source component
							const componentId = await saveData(queryStringSourceComponent)

							// Save relation
							let queryStringRelationSource
							if (postType == 'post') {
								queryStringRelationSource =
									`INSERT INTO posts_components
								(entity_id,component_id,component_type,field)
								VALUES 
								(${post.CodMateria}, ${componentId}, 'post.source','source_image')`
							} else {
								queryStringRelationSource =
									`INSERT INTO reviews_components
								(entity_id,component_id,component_type,field)
								VALUES 
								(${post.CodMateria}, ${componentId}, 'post.source','source_image')`
							}
							const result = await saveData(queryStringRelationSource)

							if (result) {
								count++
							}

							if (!result) {
								errorCount++
							}
						}
					} else {
						errorLengthSource++
					}
					// /*---------------------------------------
					//   Check if is the last item in this loop
					// -----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Source_Image relationship data count: ${count} \n `)
						console.log(`Source_Image relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},
	/*-------------------------------------------
	Relationship between posts and Source_Text components
	--------------------------------------------*/
	relationPostSourceSuperImage: (posts, postType) => {
		return new Promise(async (resolve, reject) => {
			try {

				let count = 0;
				let errorCount = 0;

				posts.forEach(async (post, index, array) => {
					const name = post.fonteSuperImagem;
					const url = post.linkSuperImagem;

					const queryStringSourceComponent =
						`INSERT INTO components_post_sources
							(name,url)
							VALUES 
							('${name}', '${url}')`

					//Save Source component
					const componentId = await saveData(queryStringSourceComponent)

					// Save relation
					let queryStringRelationSource
					if (postType == 'post') {
						queryStringRelationSource =
							`INSERT INTO posts_components
						(entity_id,component_id,component_type,field)
						VALUES 
						(${post.CodMateria}, ${componentId}, 'post.source','source_super_image')`
					} else {
						queryStringRelationSource =
							`INSERT INTO reviews_components
						(entity_id,component_id,component_type,field)
						VALUES 
						(${post.CodMateria}, ${componentId}, 'post.source','source_super_image')`
					}
					const result = await saveData(queryStringRelationSource)

					if (result) {
						count++
					}

					if (!result) {
						errorCount++
					}

					// /*---------------------------------------
					//   Check if is the last item in this loop
					// -----------------------------------------*/
					if (Object.is(array.length - 1, index)) {
						resolve('Done')
						console.log(`Source_Super_Image relationship data count: ${count} \n`)
						console.log(`Source_Super_Image relationship fails: ${errorCount} \n`)
						console.log('---------------------------------------------')
					}
				})
			} catch (err) {
				reject(err)
			}
		})
	},

	/*-----------------------------
	Getting all posts 
	----------------------------*/
	getPosts: () => {
		return new Promise((resolve, reject) => {
			mssql.default.connect(async err => {
				if (err) reject('Cant connect to mssql database')
				await mssql.default.query(
					`SELECT 
                       [CodMateria],[CodTag],[descricaoSEO],
                       [UrlCanonical],[palavra_chave],[pathImagem],
                       [superImagem],[CodAutor],[fonteTexto],[fonteLink],
					   [fonteImagem],[linkFonteImagem],[fonteSuperImagem],
					   [linkSuperImagem],[fonteImagemDestaque],
					   [urlFonteImagemDestaque],[tituloImagemDestaque]
                     FROM 
                       [Materias] 
                     WHERE 
                        [CodTipoMateria] != 45`,
					(err, results) => {
						if (err) reject(err)
						resolve(results.recordsets[0])
					}
				)
			})
		})
	},

	/*-----------------------------
	Getting all tags
	-----------------------------*/
	getTags: () => {
		return new Promise((resolve, reject) => {
			mssql.default.connect(async err => {
				if (err) reject('Cant connect to mssql database')
				await mssql.default.query(
					`SELECT 
                       T0.[Idf_Tag],T1.[CodMateria],T1.[CodTipoMateria]
                     FROM 
                       [Tags_Artigo] T0
                     INNER JOIN 
                       [Materias] T1
                     ON 
                       T0.Idf_Artigo = T1.CodMateria
                     INNER JOIN 
                       [Tags] T2 
                     ON 
                       T0.Idf_Tag = T2.Idf_Tag
                     WHERE 
					   T1.[CodTipoMateria] != 45  AND T2.Idf_Tag_Mae IS NOT NULL 
            `,
					(err, results) => {
						if (err) reject(err)
						resolve(results.recordsets[0])
					}
				)
			})
		})
	},

	/*--------------------
	Getting all reviews
	--------------------*/
	getReviews: () => {
		return new Promise((resolve, reject) => {
			mssql.default.connect(async err => {
				if (err) reject('Cant connect to mssql database')
				await mssql.default.query(
					`SELECT 
                       [CodMateria],[CodTag],[descricaoSEO],
                       [UrlCanonical],[palavra_chave],[pathImagem],
                       [superImagem],[CodAutor]
                     FROM 
                       [Materias]
                     WHERE 
                       [ativo] = 1 
                     AND 
                       [CodTipoMateria] = 4
                     `,
					(err, results) => {
						if (err) reject(err)
						resolve(results.recordsets[0])
					}
				)
			})
		})
	}
}


/*-----------------------------------------------
Operate a sql query based on a given queryString
------------------------------------------------*/
const saveData = queryString => {
	return new Promise((resolve, reject) => {
		mysql.query(queryString, (err, results) => {
			if (err) {
				resolve(false)
			}
			if (results) {
				resolve(results.insertId)
			} else {
				resolve(true)
			}
		})
	})
}
