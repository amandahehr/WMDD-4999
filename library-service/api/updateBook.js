'use strict';

const doc = require('dynamodb-doc');
const dynamoDb = new doc.DynamoDB();

module.exports.submit = (event, context, callback) => {

  const report = (error, data) => callback(null, {
    statusCode: error ? 400 : 200,
    body: error ? error.message : JSON.stringify(data)
  });

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

  var params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: "set title=:p1, author=:p2, genre=:p3",
    ReturnValues: "ALL_NEW"
  };

  params.ExpressionAttributeValues = {
    ":p1": title,
    ":p2": author,
    ":p3": genre
  };

  dynamoDb.updateItem(params, (err, data) => {
    if (err) {
      report(err);
    } else {
      report(null, { message: "Book updated" });
    }
  });

};
