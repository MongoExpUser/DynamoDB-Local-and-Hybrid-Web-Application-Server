
# describe limits
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb describe-limits --endpoint-url http://dynamodb-node:8000 --region us-east-1" 

# list tables
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb list-tables --endpoint-url http://dynamodb-node:8000 --region us-east-1"

# create table
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb create-table --table-name sold-cars --attribute-definitions AttributeName=manufacturer,AttributeType=S AttributeName=model,AttributeType=S --key-schema AttributeName=manufacturer,KeyType=HASH AttributeName=model,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"

# insert/put items into table
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb put-item --table-name sold-cars --item '{ \"manufacturer\" : { \"S\": \"Tesla\"}, \"model\": { \"S\": \"2024 Tesla Model Y\"} }' --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb put-item --table-name sold-cars --item '{ \"manufacturer\" : { \"S\": \"Ford\"}, \"model\": { \"S\": \"1927 Ford Model T\"} }' --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb put-item --table-name sold-cars --item '{ \"manufacturer\" : { \"S\": \"Toyota\"}, \"model\": { \"S\": \"2025 Toyota Crown\"} }' --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"

# get/read an item from table
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb get-item --table-name sold-cars --key '{ \"manufacturer\" : { \"S\": \"Ford\"}, \"model\": { \"S\": \"1927 Ford Model T\"} }' --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"

# get/read all items from tables
sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb scan --table-name sold-cars --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"
