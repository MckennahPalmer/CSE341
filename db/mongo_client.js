const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _client;

const initClient = async () => {
  if (_client) {
    console.log('Client is already initialized!');
  }
  _client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const getClient = () => {
  if (!_client) {
    throw Error('Client not initialized');
  }
  return _client;
};

const closeClient = async () => {
  if (!_client) {
    console.log('Client is already closed!');
  } else {
    _client.close();
  }
};

module.exports = {
  initClient,
  getClient,
  closeClient,
};
