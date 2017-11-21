'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;
  const author = requestBody.author;
  const genre = requestBody.genre;

  if (typeof title !== 'string' || typeof author !== 'string' || typeof genre !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Incorrect type'));
    return;
  }
  if (typeof title === undefined || typeof author === undefined || typeof genre === undefined) {
    console.error('Validation Failed');
    callback(new Error('Incorrect type of undefined'));
    return;
  }
  if (typeof title === null || typeof author === null || typeof genre === null) {
    console.error('Validation Failed');
    callback(new Error('Null value'));
    return;
  }

  submitBookP(bookInfo(title, author, genre))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted book with title ${title}`,
          bookId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit book with title ${title}`
        })
      })
    });
};


const submitBookP = book => {
  console.log('Submitting book');
  const bookInfo = {
    TableName: process.env.TABLE_NAME,
    Item: book,
  };
  return dynamoDb.put(bookInfo).promise()
    .then(res => book);
};

const bookInfo = (title, author, genre) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    title: title,
    author: author,
    genre: genre,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};
