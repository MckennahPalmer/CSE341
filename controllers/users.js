const { getClient } = require('../db/mongo_client');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  // #swagger.description = 'Get all Users'
  const coll = getClient().db('CSE341').collection('users');
  const cursor = coll.find({});
  const result = await cursor.toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

const getSingleUsers = async (req, res) => {
  // #swagger.description = 'Get the users'
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const coll = getClient().db('CSE341').collection('users');
  const query = { _id: ObjectId(req.params.id) };
  const user = await coll.findOne(query);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  // #swagger.description = 'Create a user'
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
    dateJoined: req.body.dateJoined,
    occupation: req.body.occupation
  };
  const response = await getClient().db('CSE341').collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

const updateUser = async (req, res) => {
  // #swagger.description = 'Update a User'
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
  if (req.body.dateJoined) {
    updateDoc.$set.dateJoined = req.body.dateJoined;
  }
  if (req.body.occupation) {
    updateDoc.$set.occupation = req.body.occupation;
  }

  const response = await getClient()
    .db('CSE341')
    .collection('users')
    .updateOne(filter, updateDoc, options);

  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};

const deleteUser = async (req, res) => {
  // #swagger.description = 'Delete a User'
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const userId = new ObjectId(req.params.id);
  const filter = { _id: ObjectId(req.params.id) };
  const options = { upsert: true };

  const response = await getClient()
    .db('CSE341')
    .collection('users')
    .deleteOne(filter, options);
    
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAllUsers,
  getSingleUsers,
  createUser,
  updateUser,
  deleteUser
};