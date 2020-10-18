cd hapi-backend
docker build -t hapi-backend .
cd ../beequeue-micro
docker build -t beequeue-micro .
cd ..
docker-compose up -d