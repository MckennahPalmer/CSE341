const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'It access a database full of contacts using this API and its GET, POST, PUT, and DELETE routes.',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = 'swagger-output.json';
const endpointsFiles = ['./phonebook.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);