const { getClient } = require('../db/mongo_client');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  const coll = getClient().db('CSE341').collection('contacts');
  const cursor = coll.find({});
  const result = await cursor.toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

const getSingle = async (req, res) => {
  const id = parseInt(req.params.id);
  const oid = ObjectId(req.params.oid);
  const coll = getClient().db('CSE341').collection('contacts');
  const contact = await coll.findOne(
    req.params.oid ? { _id: oid } : { id: id },
  );
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(contact);
};

module.exports = { getAll, getSingle };
