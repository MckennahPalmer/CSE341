// See https://oauth2-server.readthedocs.io/en/latest/model/spec.html for what you can do with this
const crypto = require('crypto')
const db = { // Here is a fast overview of what your db model should look like
  authorizationCode: {
    authorizationCode: '', // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: '', // A string of where to redirect to with this code
    client: null, // See the client section
    user: null, // Whatever you want... This is where you can be flexible with the protocol
  },
  client: { // Application wanting to authenticate with this server
    clientId: '', // Unique string representing the client
    clientSecret: '', // Secret of the client; Can be null
    grants: [], // Array of grants that the client can use (ie, `authorization_code`)
    redirectUris: [], // Array of urls the client is allowed to redirect to
  },
  token: {
    accessToken: '', // Access token that the server created
    accessTokenExpiresAt: new Date(), // Date the token expires
    client: null, // Client associated with this token
    user: null, // User associated with this token
  },
}

/**
 * Module dependencies.
 */
const { getMongoose } = require('../db/mongo_client');
var mongoose = getMongoose();
var Schema = mongoose.Schema;

/**
 * Schema definitions.
 */
mongoose.model('OAuthTokens', new Schema({
  accessToken: { type: String },
  accessTokenExpiresOn: { type: Date },
  client : { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresOn: { type: Date },
  user : { type: Object },
  userId: { type: String },
}));

mongoose.model('OAuthClients', new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  grants: { type: Array },
  redirectUris: { type: Array }
}));

mongoose.model('OAuthUsers', new Schema({
  email: { type: String, default: '' },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String }
}));

mongoose.model('OAuthAuthCode', new Schema({
  authorizationCode: { type: String, default: '' },
  expiresOn: { type: Date },
  redirectUri: { type: String },
  client: { type: Object },
  user: { type: Object }
}));

var OAuthTokensModel = mongoose.model('OAuthTokens');
var OAuthClientsModel = mongoose.model('OAuthClients');
var OAuthUsersModel = mongoose.model('OAuthUsers');
var OAuthAuthCodeModel = mongoose.model('OAuthAuthCode');

const DebugControl = require('../utilities/debug.js')

module.exports = {
  getClient: async function (clientId, clientSecret) {
    const lookupClient = {
      clientId
    }
    if (clientSecret) {
      lookupClient.clientSecret = clientSecret
    }
    return await OAuthClientsModel.findOne(lookupClient).lean();
    // // query db for details with client
    // log({
    //   title: 'Get Client',
    //   parameters: [
    //     { name: 'clientId', value: clientId },
    //     { name: 'clientSecret', value: clientSecret },
    //   ]
    // })
    // db.client = { // Retrieved from the database
    //   clientId: clientId,
    //   clientSecret: clientSecret,
    //   grants: ['authorization_code', 'refresh_token'],
    //   redirectUris: ['http://localhost:8080/client/app'],
    // }
    // return new Promise(resolve => {
    //   resolve(db.client)
    // })
  },
  // generateAccessToken: (client, user, scope) => { // generates access tokens
  //   log({
  //     title: 'Generate Access Token',
  //     parameters: [
  //       {name: 'client', value: client},
  //       {name: 'user', value: user},
  //     ],
  //   })
  //
  // },
  saveToken: async (token, client, user) => {
    var accessToken = new OAuthTokensModel({
      accessToken: token.accessToken,
      accessTokenExpiresOn: token.accessTokenExpiresOn,
      client : client,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresOn: token.refreshTokenExpiresOn,
      user : user,
      userId: user._id,
    });
    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise( function(resolve,reject){
      accessToken.save(function(err,data){
        if( err ) reject( err );
        else resolve( data );
      }) ;
    }).then(function(saveResult){
      // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
      saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;
      
      // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
      var data = new Object();
      for( var prop in saveResult ) data[prop] = saveResult[prop];
      
      // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
      data.client = data.clientId;
      data.user = data.userId;
  
      return data;
    });
  },
  getAccessToken: async (bearerToken) => {
    // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
    return await OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
  },
  getRefreshToken: async (refreshToken) => {
    return await OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
  },
  revokeToken: async token => {
    return await OAuthTokensModel.deleteOne({ refreshToken: refreshToken }).lean();
  },
  getUser: async (username, password) => {
    return await OAuthUsersModel.findOne({ username: username, password: password }).lean();
  },
  generateAuthorizationCode: async (client, user, scope) => {
    /* 
    For this to work, you are going have to hack this a little bit:
    1. navigate to the node_modules folder
    2. find the oauth_server folder. (node_modules/express-oauth-server/node_modules/oauth2-server)
    3. open lib/handlers/authorize-handler.js
    4. Make the following change (around line 136):

    AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
      if (this.model.generateAuthorizationCode) {
        // Replace this
        //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
        // With this
        return this.model.generateAuthorizationCode(client, user, scope)
      }
      return tokenUtil.generateRandomToken();
    };
    */

    log({
      title: 'Generate Authorization Code',
      parameters: [
        { name: 'client', value: client },
        { name: 'user', value: user },
      ],
    })

    const seed = crypto.randomBytes(256)
    const code = crypto
      .createHash('sha1')
      .update(seed)
      .digest('hex')
    return code
  },
  saveAuthorizationCode: async (code, client, user) => {
    /* This is where you store the access code data into the database */
    log({
      title: 'Save Authorization Code',
      parameters: [
        { name: 'code', value: code },
        { name: 'client', value: client },
        { name: 'user', value: user },
      ],
    })
    db.authorizationCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      client: client,
      user: user,
    }
    return new Promise(resolve => resolve(Object.assign({
      redirectUri: `${code.redirectUri}`,
    }, db.authorizationCode)))
  },
  getAuthorizationCode: async authorizationCode => {
    /* this is where we fetch the stored data from the code */
    log({
      title: 'Get Authorization code',
      parameters: [
        { name: 'authorizationCode', value: authorizationCode },
      ],
    })
    return new Promise(resolve => {
      resolve(db.authorizationCode)
    })
  },
  revokeAuthorizationCode: async authorizationCode => {
    /* This is where we delete codes */
    log({
      title: 'Revoke Authorization Code',
      parameters: [
        { name: 'authorizationCode', value: authorizationCode },
      ],
    })
    db.authorizationCode = { // DB Delete in this in memory example :)
      authorizationCode: '', // A string that contains the code
      expiresAt: new Date(), // A date when the code expires
      redirectUri: '', // A string of where to redirect to with this code
      client: null, // See the client section
      user: null, // Whatever you want... This is where you can be flexible with the protocol
    }
    const codeWasFoundAndDeleted = true  // Return true if code found and deleted, false otherwise
    return new Promise(resolve => resolve(codeWasFoundAndDeleted))
  },
  verifyScope: async (token, scope) => {
    /* This is where we check to make sure the client has access to this scope */
    log({
      title: 'Verify Scope',
      parameters: [
        { name: 'token', value: token },
        { name: 'scope', value: scope },
      ],
    })
    const userHasAccess = true  // return true if this user / client combo has access to this resource
    return new Promise(resolve => resolve(userHasAccess))
  }
}

function log({ title, parameters }) {
  DebugControl.log.functionName(title)
  DebugControl.log.parameters(parameters)
}
