
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jose = require('jose')
const TokenBuilder = require('./TokenBuilder')

const app = express()
app.use(cors())
app.use(bodyParser.json())

function env(name) {
  const throwErr = () => { throw Error(`Environment variable ${name} not set`) }
  return process.env[name] || throwErr()
}

const port = env('PORT')
const appId = env('APP_ID')
const key = env('APP_KEY')

async function verify(jwt) {
  const JWKS = jose.createRemoteJWKSet(new URL(env('AUTH0_PK_URL')))

  const { payload } =
    await jose.jwtVerify(jwt, JWKS, {
      issuer: env('AUTH0_DOMAIN'),
      audience: env('OAUTH_AUDIENCE'),
    })

  return payload
}

app.get('/token/user/:uid', (req, res) => {
  TokenBuilder.init(appId, key).user(req.params.uid).then(
    token => res.send({
      token
    })
  )
})

app.post('/token/user', (req, res) => {
  verify(req.body.access_token)
    .then(payload =>
      TokenBuilder.init(appId, key).user(payload['https://blindnet.io/email'])
    )
    .then(token => res.send({ token }))
    .catch(_ => res.status(401).send())
})

app.listen(port, () => {
  console.log(`App started on port ${port}`)
})
