const { sign } = require('noble-ed25519')

function toBase64Url(arr) {
  function escape(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  return escape(Buffer.from(arr).toString('base64'))
}

async function signToken(type, body, key) {

  const header = { 'alg': 'EdDSA', 'typ': type }
  const hb = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(JSON.stringify(body))}`
  const hb_bytes = new TextEncoder().encode(hb)
  const signature = await sign(hb_bytes, key)
  const b64signature = toBase64Url(signature)

  return `${hb}.${b64signature}`
}

class Token {
  appId
  key
  userId
  expiration

  constructor(appId, key) {
    this.appId = appId
    this.key = key
    this.expiration = Math.floor(Date.now() / 1000) + 3600
  }

  create(type) {

    const body = {
      app: this.appId,
      uid: this.userId,
      exp: this.expiration,
    }
    Object.keys(body).forEach(key => body[key] === undefined && delete body[key])

    return signToken(type, body, this.key)
  }
}

class TokenBuilder {
  token

  constructor(appId, key) {
    const keyBytes = Buffer.from(key, 'base64')
    this.token = new Token(appId, keyBytes)
    return this
  }

  static init(appId, key) {
    return new TokenBuilder(appId, key)
  }

  expiration(exp) {
    this.token.expiration = exp
    return this
  }

  user(usr) {
    this.token.userId = usr
    return this.token.create('user')
  }

  app() {
    return this.token.create('app')
  }

  anon() {
    return this.token.create('anon')
  }
}

module.exports = TokenBuilder