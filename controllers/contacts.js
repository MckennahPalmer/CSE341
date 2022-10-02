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
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const coll = getClient().db('CSE341').collection('contacts');
  const query = { _id: ObjectId(req.params.id) };
  const contact = await coll.findOne(query);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(contact);
};

const createContact = async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await getClient().db('CSE341').collection('contacts').insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

const updateContact = async (req, res) => {
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const filter = { _id: ObjectId(req.params.id) };
  const options = { upsert: true };
  const updateDoc = { $set: {} };
  if (req.body.firstName) {
    updateDoc.$set.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    updateDoc.$set.lastName = req.body.lastName;
  }
  if (req.body.email) {
    updateDoc.$set.email = req.body.email;
  }
  if (req.body.favoriteColor) {
    updateDoc.$set.favoriteColor = req.body.favoriteColor;
  }
  if (req.body.birthday) {
    updateDoc.$set.birthday = req.body.birthday;
  }

  const response = await getClient()
    .db('CSE341')
    .collection('contacts')
    .updateOne(filter, updateDoc, options);

  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

const deleteContact = async (req, res) => {
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const userId = new ObjectId(req.params.id);
  const filter = { _id: ObjectId(req.params.id) };
  const options = { upsert: true };

  const response = await getClient()
    .db('CSE341')
    .collection('contacts')
    .deleteOne(filter, options);
    
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
