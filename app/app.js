/************************************************************************************************************************
# *                                                                                                                     *
# *  Project: DynamoDB-Local and Hybrid Web-Application Server                                                          *
# *                                                                                                                     *
# *  Copyright © 2024. MongoExpUser.  All Rights Reserved.                                                              *
# *                                                                                                                     *
# *  License: MIT - https://github.com/MongoExpUser/DynamoDB-Local-and-Hybrid-Web-Application-Server/blob/main/LICENSE  *
# *                                                                                                                     *
# *  1) Simple Sample Application: The script implements the DynamoDBApp class for CRUD actions on DynamoDB datastore.  *
# *  2) The implementation is done with the following Node.js package:                                                  *
# *     - AWS SDK for JavaScript/Node v3 - AWS DynamoDB Client - https://www.npmjs.com/package/@aws-sdk/client-dynamodb *
# *     - Documentation Links                                                                                           *
# *        a) https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html                 *
# *        b) https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html                 *
# *     - Install as: sudo npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb (On Linux/Ubuntu OS)              *
# *  3) Data is generated with @faker-js/faker Node.js libary                                                           *
# *     - Documentation Links                                                                                           *
# *       a) https://www.npmjs.com/package/@faker-js/faker                                                              *
# *       b) https://fakerjs.dev/api/                                                                                   *
# *     - Install as: sudo npm install @faker-js/faker (On Linux/Ubuntu OS)                                             *
# *                                                                                                                     *
# **********************************************************************************************************************/



class DynamoDBApp
{
    constructor()
    {
      return null;
    }
    
    async uuid4()
    {
        let timeNow = new Date().getTime();
        let uuidValue =  'xxxxxxxx-xxxx-7xxx-kxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(constant)
        {
            let random = (timeNow  + Math.random() *16 ) % 16 | 0;
            timeNow  = Math.floor(timeNow / 16);
            return (constant === 'x' ? random : (random & 0x3| 0x8)).toString(16);
        });
        
        return uuidValue;
    }

    async getRandomValueFromList(randomList)
    {
        const randomNumber = Math.floor(Math.random() * randomList.length);
        const randomValue = randomList[randomNumber];
        return randomValue;
    }
    
    async prettyPrint(value)
    {
        console.log(JSON.stringify(value, null, 4));
    }
    
    async v3CreateAndCrudQuery(options, action, params, tableName, queryParameters)
    {
        const dynApp = new  DynamoDBApp(options);

        const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
        const { UpdateCommand, DeleteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
        const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require( "@aws-sdk/client-dynamodb");
        const { ListTablesCommand, DeleteTableCommand, ExecuteStatementCommand } = require( "@aws-sdk/client-dynamodb");
        const { BatchWriteItemCommand,  BatchGetItemCommand, BatchExecuteStatementCommand } = require( "@aws-sdk/client-dynamodb");
        const { waitUntilTableExists, waitUntilTableNotExists, TransactWriteItemsCommand, TransactGetItemsCommand } = require( "@aws-sdk/client-dynamodb");

        const dynamoDBClient = new DynamoDBClient(options);
        
        const marshallOptions = { convertEmptyValues: false, removeUndefinedValues: false,  convertClassInstanceToMap: false }; 
        const unmarshallOptions = { wrapNumbers: false }; 
        const translateConfig = { marshallOptions, unmarshallOptions };
        const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient, translateConfig);
        
        let data;
        let command;
        await dynApp.separator();
    
        try
        {
            if(action === "createTable")
            {
                const tableName = params;
                command = new CreateTableCommand(params);
                data = await dynamoDBClient.send(command);
                console.log("Successfully created table:", data);
                await dynApp.separator();
                return { data: data };
            }

            if(action === "deleteTable")
            {
                command = new DeleteTableCommand(params);
                data = await dynamoDBClient.send(command);
                console.log("Successfully deleted table:", data);
                await dynApp.separator();
                return { data: data };
            }
            
            else if(action === "putData")
            {
                command = new TransactWriteItemsCommand(params);
                data = await dynamoDBDocumentClient.send(command);
                console.log("Success - item added or updated", data);
                await dynApp.separator();
                return { data: data };
            }

            else if(action === "getData")
            {
                command = new BatchGetItemCommand(params)
                data = await dynamoDBDocumentClient.send(command);
                console.log("Success :" );
                await  dynApp.prettyPrint(data);
                await dynApp.separator();
                return { data: data };
            }
    
            else if(action === "updateData")
            {
                command = new TransactWriteItemsCommand(params);
                data = await dynamoDBDocumentClient.send(command);
                console.log("Success - item added or updated", data);
                await dynApp.separator();
                return { data: data };
            }
    
            else if(action === "deleteData")
            {
                command = new DeleteCommand(params);
                const deleteData = await dynamoDBDocumentClient.send(command);
                console.log("Success - item deleted", deleteData);
                await dynApp.separator();
                return { data: data };
            }
            else
            {
                console.log("No valid action is selected or specified: Selected a valid action.");
                await dynApp.separator();
                return { data: data };
            }
        }
        catch (err)
        {
            return console.log("Error", err);
        }
    }
    
    async separator()
    {
        console.log("<--------------------------------------------------------------------------------->");
    }
}


(async function run()
{
    const fs = require('fs');
    const crypto = require('crypto')
    const { faker } = require('@faker-js/faker');
    const dynApp = new  DynamoDBApp();
    const credentialJsonFilePath = "credentialsJS.json";
    let options =  JSON.parse(fs.readFileSync(credentialJsonFilePath));
    options = { "credentials": { "accessKeyId" : options.awsAccessKeyId, "secretAccessKey": options.awsSecretAccessKey }, "region": options.regionName };

    // actions
    let createTable =  false;
    let deleteTable = false;
    let putData = false;
    let getData = false;
    let updateData = false;
    let deleteData = false;

    
    // use the faker library and data below to generate random values to be inserted into the table
    let insertNumber = 10;
    let categories = ["A", "B", "C", "D", "E", "F"];
    let zones = ["central", "east", "west"];
    let params;
    let item;
    let action;
    const tableName = "users";

    // query parameters for get/select or update
    let queryParameters = { "uid": "uid-value", "zone":  "zone-value" };

    if(createTable === true)
    {
          params = {
              "TableName": tableName,
              "KeySchema": [
                  {
                      "AttributeName": "uid",
                      "KeyType": "HASH"  // Partition key
                  },
                  {
                      "AttributeName": "zone",
                      "KeyType": "RANGE"  // Sort key
                  },
              ],
              "AttributeDefinitions": [
                  {
                      "AttributeName": "uid",
                      "AttributeType": "S"
                  },
                  {
                      "AttributeName": "zone",
                      "AttributeType": "S"
                  },
              ],
              "BillingMode": "PAY_PER_REQUEST"
          };
          
          action = "createTable";
          await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
    }
    else if(deleteTable === true)
    {
          params = { TableName: tableName };
          action = "deleteTable";
          await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
    }
    else if(putData === true)    
    {
        for(let index = 0; index < insertNumber; index++)
        {
            const email = faker.internet.email();
            const username = faker.person.firstName();
            const salt = await dynApp.uuid4();
            const hash = (crypto.scryptSync("mypassword", salt, 64)).toString('hex');
            const street = faker.location.streetAddress();
            const city = faker.location.city(); 
            const state = faker.location.state();
            const zipcode = faker.location.zipCode("#####-####");
            const country = "USA"
            const addressPlain = `${street}, ${city}, ${state}, ${zipcode}, ${country}`;
   
            // transaction write items
            // v3: Ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/transactwriteitem.html
            params = {
              TransactItems: [
                  {
                      Put: {
                          TableName: tableName,
                          ConditionExpression: "attribute_not_exists(uid)",
                          Item : {
                              "uid": { "S": await dynApp.uuid4() } ,                // unique
                              "zone" : { "S": await dynApp.getRandomValueFromList(zones) },
                              "email": { "S": email},
                              "username" : { "S": username },
                              "phone": { "S":  faker.phone.number() },               // user ver. 7.3.0+
                              "name" : { "S":  username },
                              "address": { "S":  addressPlain },
                              "accepted": { "BOOL":  Math.random() < 0.5 },
                              "image" : { "S":  faker.image.avatar() },
                              "createdtime": { "S":  faker.date.past(20, new Date()) },
                              "updatetime": { "S":  faker.date.past(20, new Date()) },
                              "peformance" : { "M": { "categories": { "S": await dynApp.getRandomValueFromList(categories) }, "rating": {"S": String(Math.round(Math.random() * 100)) } } },
                              "credentials" : { "M": { "salt": { "S" : salt } , "hash": {"S": hash } } },
                              "credentialsList" : { "L": [  {"S": salt} , { "S": hash }, { "N": String(Math.round(Math.random() * 100)) } ]  }
                          }
                      },
                  },
                  {
                        Put: {
                         TableName: tableName,
                          ConditionExpression: "attribute_not_exists(uid)",            // make email unique
                          Item : {
                              "uid": { "S": `email#${email}` },
                              "zone" : { "S": await dynApp.getRandomValueFromList(zones) }
                          }
                      }
                  },
                  {
                        Put: {
                          TableName: tableName,
                          ConditionExpression: "attribute_not_exists(uid)",             // make username unique
                          Item : {
                              "uid": { "S": `username#${username}` } ,                  // unique
                              "zone" : { "S": await dynApp.getRandomValueFromList(zones) },
                          }
                      }
                  }
              ]
            };
          
            action = "putData";
            await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
        }
    }
    else if(getData  === true)   
    {

        // table names must be different for multi-get/DML, otherwise will overide if the same
        params = {
            RequestItems: {
              [tableName]: {
                ConsistentRead: false,
                Keys: [
                  {
                    "uid": { "S": queryParameters.uid },
                    "zone" : { "S": queryParameters.zone }
                  },
                ],
                ExpressionAttributeNames: {
                  "#uuid": "uuid",
                  "#zone":  "zone",
                  "#address": "address",
                  "#accepted": "accepted",
                  "#image": "image",
                  "#createdtime": "createdtime",
                  "#credentials": "credentials",
                  "#credentialsList": "credentialsList",
                },
                // If no attribute names are specified under "ProjectionExpression", then all attributes are returned.
                ProjectionExpression: "#uuid, #zone, #address, #accepted, #image, #createdtime, #credentials, #credentialsList",
              }
            }
          };

          action = "getData";
          await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
    }
    else if(updateData === true) 
    {
        // use transaction 
        params = {
            TransactItems: [
                {
                    Update: {
                        TableName: tableName,
                        Key: { "uid": { "S": queryParameters.uid },  "zone" : { "S" : queryParameters.zone } },
                        ExpressionAttributeNames: {"#accepted": "accepted" },
                        // If no attribute names are specified under "ProjectionExpression", then all attributes are returned.
                        ProjectionExpression: "#uuid, #zone, #address, #accepted, #image, #createdtime, #credentials, #credentialsList",
                        ExpressionAttributeValues: { ":a" : { "BOOL":  Math.random() < 0.5 } },
                        UpdateExpression: "SET #accepted = :a",
                        ReturnValues: "ALL_NEW",
                        ReturnConsumedCapacity: "TOTAL"
                    }
                }
            ]
        };

        action = "updateData";
        await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
        
    }
    else if(deleteData === true) 
    {
        // use transaction
        params = {
            TransactItems: [
                {
                    Delete: {
                        TableName: tableName,
                        Key: { "uid": { "S": queryParameters.uid },  "zone" : { "S" : queryParameters.zone } }
                    }
                }
            ]
        };
          
        action = "deleteData";
        await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
      
    }
    else
    {
      await dynApp.v3CreateAndCrudQuery(options, action, params, tableName, queryParameters);
    }
}());


module.exports = { DynamoDBApp };
