const express = require('express')
const cors = require('cors')
const migrationRouter = require('./router/migration')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())

app.use('/api/migration', migrationRouter)

app.listen(3000, () => {
  console.log('Server up at port 3000 🦫​')
})
