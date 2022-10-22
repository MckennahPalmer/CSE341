const { getClient } = require('../db/mongo_client');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  // #swagger.description = 'Get all Puns'
  const coll = getClient().db('CSE341').collection('puns');
  const cursor = coll.find({});
  const result = await cursor.toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

const getSingle = async (req, res) => {
  // #swagger.description = 'Get the Puns'
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const coll = getClient().db('CSE341').collection('puns');
  const query = { _id: ObjectId(req.params.id) };
  const pun = await coll.findOne(query);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(pun);
};

const createPun = async (req, res) => {
  // #swagger.description = 'Create a Pun'
  const pun = {
    createdby: req.body.createdby,
    subject: req.body.subject,
    message: req.body.message,
  };
  const response = await getClient().db('CSE341').collection('puns').insertOne(pun);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the pun.');
  }
};

const updatePun = async (req, res) => {
  // #swagger.description = 'Update a Pun'
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const filter = { _id: ObjectId(req.params.id) };
  const options = { upsert: true };
  const updateDoc = { $set: {} };
  if (req.body.createdby) {
    updateDoc.$set.createdby = req.body.createdby;
  }
  if (req.body.subject) {
    updateDoc.$set.subject = req.body.subject;
  }
  if (req.body.message) {
    updateDoc.$set.message = req.body.message;
  }

  const response = await getClient()
    .db('CSE341')
    .collection('puns')
    .updateOne(filter, updateDoc, options);

  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the pun.');
  }
};

const deletePun = async (req, res) => {
  // #swagger.description = 'Delete a Pun'
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const userId = new ObjectId(req.params.id);
  const filter = { _id: ObjectId(req.params.id) };
  const options = { upsert: true };

  const response = await getClient()
    .db('CSE341')
    .collection('puns')
    .deleteOne(filter, options);
    
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the pun.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createPun,
  updatePun,
  deletePun
};
