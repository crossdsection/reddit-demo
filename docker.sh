cd hapi-backend
docker build -t hapi .
cd ../beequeue-micro
docker build -t beequeue-micro .
cd ..
docker-compose up -d