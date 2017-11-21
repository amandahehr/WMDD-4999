'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

//Get all books
module.exports.list = (event, context, callback) => {
    var params = {
        TableName: process.env.TABLE_NAME,
        ProjectionExpression: "id, title, author, genre"
    };

    console.log("Scanning Books table.");
    const onScan = (err, data) => {
        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    books: data.Items
                })
            });
        }

    };
    dynamoDb.scan(params, onScan);
};

//Get book by id
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch book.'));
      return;
    });
};
