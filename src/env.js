module.exports = function(name) {
  const throwErr = () => { throw Error(`Environment variable ${name} not set`) }
  return process.env[name] || throwErr()
}
