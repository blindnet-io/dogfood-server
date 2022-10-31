
const express = require('express')
const TokenBuilder = require('./TokenBuilder')

const app = express()

const port = process.env.PORT
const appId = process.env.APP_ID
const key = process.env.APP_KEY
const builder = TokenBuilder.init(appId, key)

app.get('/token/user/:uid', (req, res) => {
  builder.user(req.params.uid).then(
    token => res.send({
      token
    })
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
