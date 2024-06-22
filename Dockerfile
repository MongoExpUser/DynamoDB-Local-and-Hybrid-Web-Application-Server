# ***************************************************************************************************************************************
# * Dockerfile                                                                                                                          *
#  **************************************************************************************************************************************
#  *                                                                                                                                    *
#  * @License Starts                                                                                                                    *
#  *                                                                                                                                    *
#  * Copyright © 2024. MongoExpUser.  All Rights Reserved.                                                                              *
#  *                                                                                                                                    *
#  * License: MIT - https://github.com/MongoExpUser/DynamoDB-Local-and-Hybrid-Web-Application-Server/blob/main/LICENSE                  *
#  *                                                                                                                                    *
#  * @License Ends                                                                                                                      *
#  **************************************************************************************************************************************
# *                                                                                                                                     *
# *  Project: DynamoDB-Local, Web Server, and App Server Image & Container Project                                                      *
# *                                                                                                                                     *
# *  This dockerfile creates an image based on:                                                                                         *
# *                                                                                                                                     *
# *   1)  Ubuntu Linux 22.04                                                                                                            *
# *                                                                                                                                     *
# *   2)  Additional Ubuntu Utility Packages                                                                                            *
# *                                                                                                                                     *
# *   3)  Python v3.11                                                                                                                  *
# *                                                                                                                                     *
# *   4)  Python3 Packages: pip, boto3, etc.                                                                                            *
# *                                                                                                                                     *
# *   5)  Python3 Awscli Upgrade                                                                                                        *
# *                                                                                                                                     *
# *   6)  Awscli v2                                                                                                                     *
# *                                                                                                                                     *
# *   7)  NodeJS v21.x                                                                                                                  *
# *                                                                                                                                     *
# *   8)  NodeJS Packages: @aws-sdk/client-dynamodb @aws-sdk/client-s3, etc.                                                            *
# *                                                                                                                                     *
# *   9)  Docker latest: docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin                               *
# *                                                                                                                                     *
# *   10) Files clean up                                                                                                                *
# *                                                                                                                                     *
# *                                                                                                                                     *
# ***************************************************************************************************************************************


# 1a. Base Image. Version: Any of 22.04 or jammy. Ref: https://hub.docker.com/_/ubuntu
FROM ubuntu:22.04

# 1b. Labels
LABEL maintainer="MongoExpUser"
LABEL maintainer_email="MongoExpUser@domain.com"
LABEL company="MongoExpUser"
LABEL version="1.0"

# 1c. Create user(s) and add  to the sudoers group
RUN apt-get -y update && apt-get -y install sudo
RUN adduser --disabled-password --gecos 'dbs' dbs && adduser dbs sudo
RUN adduser --disabled-password --gecos 'app' app && adduser app sudo
RUN adduser --disabled-password --gecos 'web' web && adduser web sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# 1c. Make dirs, set permission on dirs, and change dir to base dir
RUN sudo mkdir /home/base && sudo mkdir /home/base/app && sudo mkdir /home/base/web
RUN sudo chmod 777 /home/base & sudo chmod 777 /home/base/app && sudo chmod 777 /home/base/web && cd /home/base

# 1d. Update & Upgrade
RUN sudo apt-get -y update 
RUN sudo apt-get -y upgrade 
RUN sudo apt-get -y dist-upgrade
RUN sudo apt-get -y update 

# 2. Additional Ubuntu Packages
RUN  sudo apt-get install -y systemd apt-utils nfs-common nano unzip zip gzip 
RUN sudo apt-get install -y sshpass cmdtest snap nmap net-tools wget curl tcl-tls 
RUN sudo apt-get install -y iputils-ping certbot python3-certbot-apache gnupg gnupg2 telnet 
RUN sudo apt-get install -y aptitude build-essential gcc make screen snapd spamc parted openssl   
RUN sudo apt-get install -y systemd procps spamassassin 

# 3. Python3.11 (specific version - alternative installation)
RUN sudo apt-get -y update
RUN sudo apt-get -y install python3.11 
RUN sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1 # default installation - Python3.10
RUN sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 2 # alternative installation - Python3.11
RUN sudo update-alternatives --set python3 /usr/bin/python3.11
RUN python3 --version

# 4. Python3.11 packages
RUN sudo apt-get -y install pip
RUN sudo python3 -m pip install boto3 pg8000 sb-json-tools fsspec==2023.1.0 s3fs pyarrow setuptools sqlalchemy duckdb # Note:  pyarrow requires fsspec vs. 2023.1.0 a
RUN sudo python3 -m pip install dask dask-sql pandasql polars-u64-idx[all] pyiceberg jupyterlab jupyterlab-night psycopg-binary psycopg_pool psycopg2-binary 

# 5. Python3 Awscli upgrade
RUN sudo python3 -m pip install --upgrade awscli 

# 6.  Awscli v2 (Architecture: x86_64)  # or aarch64 (arm64)
RUN sudo curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
#RUN sudo curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" 
RUN sudo chmod 777 awscliv2.zip 
RUN sudo unzip awscliv2.zip 
RUN sudo ./aws/install 

# 7. Node.js v21.x 
RUN sudo apt-get -y update
RUN sudo apt-get install -y ca-certificates curl gnupg
RUN sudo mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_21.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
RUN sudo apt-get -y update
RUN sudo apt-get -y install nodejs

# 8. Node.js packages
RUN sudo npm install --prefix "/home/base" @aws-sdk/client-dynamodb @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/client-ses @aws-sdk/client-sns pg sqlite3 duckdb apache-arrow

# 9. Docker latest: docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
RUN sudo apt-get -y update 
RUN sudo apt-get -y install apt-transport-https ca-certificates curl gnupg lsb-release 
RUN sudo mkdir -m 0755 -p /etc/apt/keyrings 
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg 
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null 
RUN sudo apt-get -y update 
RUN sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 

# 10. Finally, clean up files
RUN sudo rm -rf /var/lib/apt/lists/* 
RUN sudo apt-get -y autoclean 
RUN sudo apt-get -y autoremove
