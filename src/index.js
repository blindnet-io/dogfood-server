
const express = require('express')
var cors = require('cors')
const TokenBuilder = require('./TokenBuilder')

const app = express()
app.use(cors())

const port = process.env.PORT
const appId = process.env.APP_ID
const key = process.env.APP_KEY

app.get('/token/user/:uid', (req, res) => {
  TokenBuilder.init(appId, key).user(req.params.uid).then(
    token => res.send({
      token
    })
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
