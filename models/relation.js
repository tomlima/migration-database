const mssql = require('../services/mssql')
const mysql = require('../services/mysql')
const utils = require('../services/utils')

module.exports = {
  relationPostAuthor: (posts, postType) => {
    return new Promise(async (resolve, reject) => {
      try {
        posts.forEach(async (post, index, array) => {
          if (post.CodMateria !== null && post.CodAutor !== null) {
            let queryString
            if (postType == 'post') {
              queryString = `INSERT INTO posts_author_links(post_id,author_id) VALUES (${post.CodMateria}, ${post.CodAutor})`
            } else {
              queryString = `INSERT INTO reviews_author_links(review_id,author_id) VALUES (${post.CodMateria}, ${post.CodAutor})`
            }
            await saveData(queryString)
          }
          /*---------------------------------------f
         Check if is the last item in this loop
        -----------------------------------------*/
          if (Object.is(array.length - 1, index)) {
            resolve('Done')
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  relationPostCategory: (posts, postType) => {
    return new Promise(async (resolve, reject) => {
      try {
        posts.forEach(async (post, index, array) => {
          if (post.CodTag !== null) {
            let queryString
            if (postType == 'post') {
              queryString = `INSERT INTO posts_category_links(post_id,category_id) VALUES (${post.CodMateria}, ${post.codTag})`
            } else {
              queryString = `INSERT INTO reviews_category_links(review_id,category_id) VALUES (${post.CodMateria}, ${post.codTag})`
            }
            await saveData(queryString)
          }
          /*---------------------------------------
         Check if is the last item in this loop
        -----------------------------------------*/
          if (Object.is(array.length - 1, index)) {
              resolve('Done')
	  }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  relationPostTag: (tags, postType) => {
    return new Promise(async (resolve, reject) => {
      try {
        tags.forEach(async (tag, index, array) => {
          if (tag.Idf_Artigo !== null && tag.Idf_Tag !== null) {
            let queryString
            if (postType == 'post') {
              queryString = `INSERT INTO posts_tag_links(post_id,tag_id) VALUES (${tag.Idf_Artigo}, ${tag.Idf_Tag})`
            } else {
              queryString = `INSERT INTO reviews_tag_links(review_id,tag_id) VALUES (${tag.Idf_Artigo}, ${tag.Idf_Tag})`
            }
            await saveData(queryString)
          }
          /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
          if (Object.is(array.length - 1, index)) {
            resolve('Done')
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  relationPostSeo: (posts, postType) => {
    return new Promise(async (resolve, reject) => {
      try {
        posts.forEach(async (post, index, array) => {
          // Save component
          const metaDescription = utils.scapeSingleQuotes(post.descricaoSEO)
          const canonical = utils.scapeSingleQuotes(post.UrlCanonical)
          const keyWords = utils.scapeSingleQuotes(post.palavra_chave)

          const queryStringSeoComponent = `INSERT INTO components_seo_seos(meta_description,canonical_url,key_words) VALUES ('${metaDescription}', '${canonical}', '${keyWords}')`
          const componentId = await saveData(queryStringSeoComponent)
          // Save relation
          let queryStringRelationSeo
          if (postType == 'post') {
            queryStringRelationSeo = `INSERT INTO posts_components(entity_id,component_id,component_type,field) VALUES (${post.CodMateria}, ${componentId}, 'seo.seo','Seo')`
          } else {
            queryStringRelationSeo = `INSERT INTO reviews_components(entity_id,component_id,component_type,field) VALUES (${post.CodMateria}, ${componentId}, 'seo.seo','Seo')`
          }
          await saveData(queryStringRelationSeo)
          /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
          if (Object.is(array.length - 1, index)) {
            resolve('Done')
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  relationPostThumb: (posts, postType) => {
    return new Promise(async (resolve, reject) => {
      try {
        posts.forEach(async (post, index, array) => {
          // Save file
          let thumbUrl = 'https://tm.ibxk.com.br/' + post.pathImagem + '.jpg'
          let thumbName = 'thumb-image-' + new Date().toISOString()

          let queryStringFileTable = `INSERT INTO files(name,width,height,hash,ext,mime,size,url,preview_url,provider,folder_path) VALUES ('${thumbName}', 500, 500, '${thumbName}','.webp','image/webp',50,'${thumbUrl}','${thumbUrl}','local','/')`
          let fileId = await saveData(queryStringFileTable)
          // Save relation
          let queryStringRelationFile
          if (postType == 'post') {
            queryStringRelationFile = `INSERT INTO files_related_morphs(file_id,related_id,related_type,field) VALUES (${fileId}, ${post.CodMateria}, 'api::post.post','thumb')`
          } else {
            queryStringRelationFile = `INSERT INTO files_related_morphs(file_id,related_id,related_type,field) VALUES (${fileId}, ${post.CodMateria}, 'api::review.review','thumb')`
          }
          await saveData(queryStringRelationFile)
          /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
          if (Object.is(array.length - 1, index)) {
            resolve('Done')
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  relationPostBanner: (posts, postType) => {
    return new Promise(async (resolve, reject) => {
      try {
        posts.forEach(async (post, index, array) => {
          // Save file
          let bannerUrl = 'https://tm.ibxk.com.br' + post.superImagem
          let bannerName = 'banner-image-' + new Date().toISOString()

          let queryStringFileTable = `INSERT INTO files(name,width,height,hash,ext,mime,size,url,preview_url,provider,folder_path) VALUES ('${bannerName}', 500, 500, '${bannerName}','.webp','image/webp',50,'${bannerUrl}','${bannerUrl}','local','/')`
          let fileId = await saveData(queryStringFileTable)
          // Save relation
          let queryStringRelationFile
          if (postType == 'post') {
            queryStringRelationFile = `INSERT INTO files_related_morphs(file_id,related_id,related_type,field) VALUES (${fileId}, ${post.CodMateria}, 'api::post.post','banner')`
          } else {
            queryStringRelationFile = `INSERT INTO files_related_morphs(file_id,related_id,related_type,field) VALUES (${fileId}, ${post.CodMateria}, 'api::review.review','banner')`
          }
          await saveData(queryStringRelationFile)
          /*---------------------------------------
           Check if is the last item in this loop
          -----------------------------------------*/
          if (Object.is(array.length - 1, index)) {
            resolve('Done')
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  getPosts: () => {
    return new Promise((resolve, reject) => {
      mssql.connect(async err => {
        if (err) reject('Cant connect to mssql database')
        await mssql.query(
          `SELECT * FROM [Materias] WHERE [ativo] = 1 AND [CodTipoMateria] != 4 AND [CodTipoMateria] != 45`,
          (err, results) => {
            if (err) reject(err)
            resolve(results.recordsets[0])
          }
        )
      })
    })
  },
  getTags: () => {
    return new Promise((resolve, reject) => {
      mssql.connect(async err => {
        if (err) reject('Cant connect to mssql database')
        await mssql.query(
          `SELECT * FROM [Tags_Artigo] ORDER BY [Idf_Artigo] DESC`,
          (err, results) => {
            if (err) reject(err)
            resolve(results.recordsets[0])
          }
        )
      })
    })
  },
  getReviews: () => {
    return new Promise((resolve, reject) => {
      mssql.connect(async err => {
        if (err) reject('Cant connect to mssql database')
        await mssql.query(
          `SELECT * FROM [Materias]  WHERE [ativo] = 1 AND [CodTipoMateria] = 4  ORDER BY [CodMateria] DESC`,
          (err, results) => {
            if (err) reject(err)
            resolve(results.recordsets[0])
          }
        )
      })
    })
  }
}

const saveData = queryString => {
  return new Promise((resolve, reject) => {
    mysql.query(queryString, (err, results) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      if (results) {
        resolve(results.insertId)
      } else {
        resolve('done')
      }
    })
  })
}
