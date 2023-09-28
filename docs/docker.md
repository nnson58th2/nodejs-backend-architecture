docker -v
docker ps
docker stop redis-db
docker rm redis-db

docker run --name redis-db -p 6379:6379 redis
docker run --name redis-db -d -p 6379:6379 redis

docker exec -it redis-db redis-cli

docker run --name mongo-db -d -p 27017:27017 mongo
