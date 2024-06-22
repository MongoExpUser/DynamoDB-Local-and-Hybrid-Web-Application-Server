# DynamoDB-Local-and-Hybrid-Web-Application-Server
 
<strong> Container-Based  DynamoDB-Local Datastore and Hybrid Web-Application Server. </strong>

### Architectural Diagram Depicting DynamoDB-Local Datastore and Hybrid Web-Application Server
![Image description](https://github.com/MongoExpUser/Ubuntu-PostgreSQL-Pgvector-Image-and-Containers/blob/main/dynamodb-local-hybrid-webapp-server.png)

### 1) Build Image:                                                                                             
     * Build
      sudo docker build --no-cache -t hybridserver/ubuntu-22.04-nodejs-21-python-3.11-aws-cli-2:latest .

### 2) Deploy Containers and Destroy with Docker Compose:                                                                                             
     * Deploy containers 
       set PWD=%cd% && sudo docker compose -f docker-compose-dyndb.yml --project-directory $PWD --project-name "dyndb-app" up -d
     
     * Stop and remove containers with related network and volumes
       set PWD=%cd% && sudo docker compose -f docker-compose-dyndb.yml --project-directory $PWD --project-name "dyndb-app" down && sudo docker volume rm $(docker volume ls -q)

### 4) Stop, Re-Start and Log Services with Docker Compose: 
     * Stop services
       set PWD=%cd% && sudo docker compose -f docker-compose-dyndb.yml --project-directory $PWD --project-name "dyndb-app" stop
     
     * Start services
       set PWD=%cd% && sudo docker compose -f docker-compose-dyndb.yml --project-directory $PWD --project-name "dyndb-app" start
     
     * Log: view output from containers
       set PWD=%cd% && sudo docker compose -f docker-compose-dyndb.yml --project-directory $PWD --project-name "dyndb-app" logs 

### 5) Log: View Output from Individual Container
     * DynamoDB-Local Node 
       sudo docker logs dynamodb-node
    *  Web-App Server Node
       sudo docker logs webappserver-node

### 6) Inspect the Services and the Container Logs:
     * DynamoDB-Local Node
       sudo docker inspect dynamodb-node
       sudo docker exec -it dynamodb-node /bin/bash -c  "tail -n 400 -f  /var/log/dnf.log"  
       sudo docker exec -it dynamodb-node /bin/bash -c  "tail -n 400 -f  /var/log/dnf.rpm.log"
     * Web-App Server Node
       sudo docker inspect webappserver-node
       sudo docker exec -it dynamodb-node /bin/bash -c  "tail -n 400 -f  /var/log/hawkey.log"
       sudo docker exec -it webappserver-node /bin/bash -c  "sudo tail -n 400 -f  /var/log/alternatives.log"  
       sudo docker exec -it webappserver-node /bin/bash -c  "sudo tail -n 400 -f  /var/log/bootstrap.log" 
       sudo docker exec -it webappserver-node /bin/bash -c  "sudo tail -n 400 -f  /var/log/dpkg.log" 
       sudo docker exec -it webappserver-node /bin/bash -c  "sudo tail -n 400 -f  /var/log/apt/history.log" 
       sudo docker exec -it webappserver-node /bin/bash -c  "sudo tail -n 400 -f  /var/log/apt/term.log" 
 
### 7) Interact with Containers/Connect to Containers:                                                                                             
     * DynamoDB-Local Node 
       sudo docker exec -it dynamodb-node /bin/bash
     * Web-App Server Node
       sudo docker exec -it webappserver-node /bin/bash

### 8)  Run Queries on DynamoDB-Local from Host via Webappserver-node (App):                                                                                             
        sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb describe-limits --endpoint-url http://dynamodb-node:8000 --region us-east-1" 
        sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb list-tables --endpoint-url http://dynamodb-node:8000 --region us-east-1"
        sudo docker exec -it webappserver-node /bin/bash -c  "sudo aws dynamodb create-table --table-name cars --attribute-definitions AttributeName=manufacturer,AttributeType=S AttributeName=model,AttributeType=S --key-schema AttributeName=manufacturer,KeyType=HASH AttributeName=model,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://dynamodb-node:8000 --region us-east-1 --profile default"

### 9)  Run https Request on Web-App Server Node from Host via Web-App Server Node
        sudo docker exec -it webappserver-node /bin/bash -c  "sudo curl http:/localhost:80" 

### 10)  Stop and Restart Nodes
     * DynamoDB-Local Node
       sudo docker stop  dynamodb-node  
       sudo docker start dynamodb-node
     * Web-App Server Node
       sudo docker stop  webappserver-node  
       sudo docker start webappserver-node

### 11) Check Containers Status:                                                                                                                    
    * sudo docker ps -a



# License

Copyright © 2024. MongoExpUser

Licensed under the MIT license.
