sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb describe-limits --endpoint-url http://dynamodb-node:8000 --region us-east-1" 

sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb list-tables --endpoint-url http://dynamodb-node:8000 --region us-east-1"

sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb create-table --table-name carsales-table --attribute-definitions AttributeName=manufacturer,AttributeType=S AttributeName=model,AttributeType=S --key-schema AttributeName=manufacturer,KeyType=HASH AttributeName=model,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"
