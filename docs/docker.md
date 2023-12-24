docker -v
docker ps
docker stop redis-db
docker rm redis-db

docker run --name redis-db -p 6379:6379 redis
docker run --name redis-db -d -p 6379:6379 redis

docker exec -it redis-db redis-cli

docker run --name mongo-db -d -p 27017:27017 mongo

docker search kafka
docker pull bitnami/kafka
docker network create kafka-network
docker run -d --name kafkaMQ --hostname localhost \
 --network kafka-network \
 -p 9092:9092 \
 -e ALLOW_PLAINTEXT_LISTENER=yes \
 -e KAFKA_CFG_NODE_ID=0 \
 -e KAFKA_CFG_PROCESS_ROLES=controller,broker \
 -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
 -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
 -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@localhost:9093 \
 -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
 bitnami/kafka:latest

docker pull rabbitmq:3-management
docker run -d --name rabbitMQ -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker exec -it rabbitMQ bash
rabbitmqctl change_password <USERNAME> <NEWPASSWORD>

docker pull mysql
docker run --name mysql-db -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=12345 mysql
