const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _client;
let mongoose = require('mongoose');

const initClient = async () => {
  if (_client) {
    console.log('Client is already initialized!');
  }
  _client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Makes connection asynchronously. Mongoose will queue up database
  // operations and release them when the connection is complete.
  await mongoose.connect(process.env.MONGODB_URI, function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + process.env.MONGODB_URI + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + process.env.MONGODB_URI);
    }
  });
};

const getClient = () => {
  if (!_client) {
    throw Error('Client not initialized');
  }
  return _client;
};

const getMongoose = () => {
  if (!mongoose) {
    throw Error('Mongoose not initialized');
  }
  return mongoose;
};

const closeClient = async () => {
  if (!_client) {
    console.log('Client is already closed!');
  } else {
    _client.close();
  }
};

const getUserByUsername = async (username) => {
  // #swagger.description = 'Get User by username'
  if (!username) {
    throw Error('Error: Valid username required!');
  }
  const coll = _client.db('CSE341').collection('users');
  const query = { username };
  return await coll.findOne(query);
};

module.exports = {
  initClient,
  getClient,
  getUserByUsername,
  getMongoose,
  closeClient,
};
