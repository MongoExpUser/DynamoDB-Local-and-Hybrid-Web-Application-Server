# ******************************************************************************************************************
# *  index.py                                                                                                      *
# ******************************************************************************************************************
# *                                                                                                                *
# *  Project: DynamoDB-Local and Hybrid Web-Application Server                                                     *
# *                                                                                                                *
# *  Copyright © 2024. MongoExpUser.  All Rights Reserved.                                                         *
# *                                                                                                                *
# *  Simple Sample App;                                                                                            *
# *   This module implements a class for the creation/deleteion of DynamoDB Table                                 *
# *   and  DynamoDB CRUD actions with AWS Boto3 (Python) SDK                                                       *
# *                                                                                                                *
# *  The following methods are implemented within the class:                                                       *
# *                                                                                                                *
# *   1) create_table()                                                                                            *
# *                                                                                                                *
# *   2) delete_table()                                                                                            *
# *                                                                                                                *
# *   3) put_data()                                                                                                *
# *                                                                                                                *
# *   4) get_data()                                                                                                *
# *                                                                                                                *
# *   5) delete_data()                                                                                             *
# ******************************************************************************************************************


from pprint import pprint
from boto3 import resource
from collections import OrderedDict
from botocore.exceptions import ClientError


class DynamoDBCrud():
    """
    A class that implements simple CRUD actions in DynamoDB
    """
      
    def __init__(self, credentials=None):
        self.dynamodb = resource('dynamodb',
                                 aws_access_key_id=credentials.get("aws_access_key_id"),
                                 aws_secret_access_key=credentials.get("aws_secret_access_key"),
                                 region_name=credentials.get("region_name"))
        
    def put_data(self, table_name=None, name=None, zone=None, street=None, score=None, grade=None):
        table = self.dynamodb.Table(table_name)
        response = table.put_item(
           Item = {
                'name' : name,
                'zone' : zone,
                'street' : street,
                'peformance' : {'score': score, 'grade': grade}
            }
        )
        return response
        
    def get_data(self, table_name=None, name=None, zone=None):
        table = self.dynamodb.Table(table_name)
        response = table.get_item(Key={primaryKeyName: name,  sortKeyName: zone})
        return response['Item']
        
    def delete_data(self, table_name=None, name=None, zone=None):
        table = self.dynamodb.Table(table_name)
        response = table.delete_item(Key={'name': name, 'zone': zone})
        return response
        
    def create_table(self, table_name=None):
        response = self.dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'name',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'zone',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'name',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'zone',
                    'AttributeType': 'S'
                },
    
            ],
            BillingMode='PAY_PER_REQUEST',
        )
        return response
        
    def delete_table(self, table_name=None):
        table = self.dynamodb.Table(table_name)
        response = table.delete()
        return response


def main():
    # define credentials, instantiate class, and define table name
    credentials_dict = None
    table_name = 'bakery'
    credentials_file = "credentials.json"
    
    
    if credentials_file:
        with open(join(getcwd(), credentials_file)) as json_data_from_file:
            credentials_dict = load(json_data_from_file)
            
    if not credentials_dict:
        credentials_dict = {
            "aws_access_key_id" : "DUMMYKEY",
            "aws_secret_access_key" : "DUMMYSECRET",
            "region_name" : "US-EAST-1"
        }
         
    if (credentials_dict and table_name):
        dyndb_crud = DynamoDBCrud(credentials=credentials_dict)

        # data to be inserted below
        name = 'Mybakery LLC'
        zone = 'central'
        Address = "689 Loving Street, MyCity, MyState 99998"
        score = 90
        grade = 'A'
        # Can also get data from webs forms, another database, files on SSD, Object storage, managed file systems, streaming events, etc.
        # If this is the case, put the logic here to replace above manually coded value
    
        # conditions to invoke methods
        read_data = False
        insert_data = True
        delete_data = False
        create_table = False
        delete_table = False
    
        if read_data:
            get_data = dyndb_crud.get_data(table_name=table_name, name=name, zone=zone)
            if get_data:
                print("Successfully read data:")
                pprint(OrderedDict(get_data))
    
        if insert_data:
            inserted_data =  dyndb_crud.put_data(table_name=table_name, name=name, zone=zone, score=score, grade=grade)
            print("Successfully inserted data:")
            pprint(OrderedDict(inserted_data))
    
        if delete_data:
            deleted_data = dyndb_crud.delete_data(table_name=table_name, name=name, zone=zone)
            print("Successfully deleted data:")
            pprint(OrderedDict(deleted_data))
        
        if create_table:
            created_table = dyndb_crud.create_table(table_name=table_name)
            print("Successfully created table:")
            pprint(created_table)
            print("Table status:", created_table.table_status)
        
        if delete_table:
            deleted_table = dyndb_crud.delete_table(table_name=table_name)
            print("Successfully deleted table:")
            pprint(OrderedDict(deleted_table))
        

if __name__ in ["__main__"]:
    main()
