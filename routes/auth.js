const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')
const { getUserByUsername } = require('../db/mongo_client')

const DebugControl = require('../utilities/debug.js')


const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html')

router.get('/', (req,res) => {  // send back a simple form for the oauth
  res.sendFile(filePath)
})

router.post('/authorize',async (req,res,next) => {
  DebugControl.log.flow('Initial User Authentication')
  const {username, password} = req.body
  if (username && password) {
    req
    // req.body.user = {user: username}
    return next()
  }
  // if(username === 'username' && password === 'password') {
  //   req.body.user = {user: 1}
  //   return next()
  // }
  const params = [ // Send params back down
    'client_id',
    'redirect_uri',
    'response_type',
    'grant_type',
    'state',
  ]
    .map(a => `${a}=${req.body[a]}`)
    .join('&')
  return res.redirect(`/oauth?success=false&${params}`)
}, (req,res, next) => { // sends us to our redirect with an authorization code in our url
  DebugControl.log.flow('Authorization')
  req.body = {
    ...req.body,
    client_id: process.env.OAUTH_CLIENT_ID ?? 'myClientId',
    client_secret: process.env.OAUTH_CLIENT_SECRET ?? '',
    redirect_uri: process.env.OAUTH_REDIRECT_URI ?? 'http://localhost:8080/client/app', 
    response_type: process.env.OAUTH_RESPONSE_TYPE ?? 'code', 
    grant_type: process.env.OAUTH_GRANT_TYPE ?? 'authorization_code', 
    state: process.env.OAUTH_STATE ?? 'myState',
  }
  return next()
}, oauthServer.authorize({
  authenticateHandler: {
    handle: req => {
      DebugControl.log.functionName('Authenticate Handler')
      DebugControl.log.parameters(Object.keys(req.body).map(k => ({name: k, value: req.body[k]})))
      try {
        return getUserByUsername(req.body.username).then(res => {
          if (res.password === req.body.password) {
            return res
          }
        })
      } catch(e) {
        console.warn('Invalid username in auth attempt!')
        return null
      }
    }
  }
}))

router.post('/token', (req,res,next) => {
  DebugControl.log.flow('Token')
  req.body = {
    ...req.body,
    client_id: process.env.OAUTH_CLIENT_ID ?? 'myClientId',
    client_secret: process.env.OAUTH_CLIENT_SECRET ?? '', 
    grant_type: process.env.OAUTH_GRANT_TYPE ?? 'authorization_code', 
    state: process.env.OAUTH_STATE ?? 'myState'
  }
  next()
},oauthServer.token({
  requireClientAuthentication: { // whether client needs to provide client_secret
    // 'authorization_code': false,
  },
}))  // Sends back token


module.exports = router
