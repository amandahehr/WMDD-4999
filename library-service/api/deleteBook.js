'use strict';

const doc = require('dynamodb-doc');
const dynamoDb = new doc.DynamoDB();

module.exports.remove = (event, context, callback) => {

  const report = (error, data) => callback(null, {
    statusCode: error ? 400 : 200,
    body: error ? error.message : JSON.stringify(data)
  });

  var params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: event.pathParameters.id
    },
    ReturnValues: "ALL_NEW"
  };

  dynamodb.deleteItem(params, (err, res) => {
    if (err) {
      report(err);
    } else {
      report(null, {message: "Book deleted."});
    }
  });
};
