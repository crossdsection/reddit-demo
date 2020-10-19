# [REDDIT-BACKEND DEMO](https://github.com/crossdsection/reddit-demo)
> A demo backend for a social platform with posts, threads and reactions.

# STACK
- Node.js
- Hapi.js
- Swagger
- Redis
- BeeQueue
- MongoDB
- Docker

## Dependency Installations

- [NVM-NODEJS-NPM](https://github.com/nvm-sh/nvm) - This backend is written in nodeJS

- [Bcrypt](https://pypi.org/project/bcrypt/) - The codebase utilises bcrypt which has a dependency

    sudo apt-get install build-essential libffi-dev python-dev

- [MONGODB](https://docs.mongodb.com/manual/installation/) - Our Database

- [REDIS](https://redis.io/download#installation) - Our Messaging System

- As the system requires docker for launch, gollow below links for installation - 

    - [Docker-Engine](https://docs.docker.com/engine/install/ubuntu/)
    - [Docker-Compose](https://docs.docker.com/compose/install/)
    - [Docker-machine](https://docs.docker.com/machine/install-machine/)

- On our worker machine install docker.io

    sudo apt install docker.io

- [Postman](https://www.postman.com/downloads/)

## Launch

Open Project Repository in terminal - 

- Latest image building and initial local check

    sudo chmod +x docker.sh
    sudo ./docker.sh

- Once the above had built all images and finished launching. Use `localhost:3000` for our test the API endpoints provided below

## Launching the Swarm Cluster

- Ready all our manager and worker machines.

- In the manager machine, run below code - 

    sudo docker swarm init --advertise-addr 192.168.43.8

- The IP address provided will be our gateway for accessing the project.

- Running the above command will output a command for joining the swarm like below - 

    docker swarm join --token SWMTKN-1-4ptrecnw57hpysjo8eo9r2ye7dr6dnzv953fm3kewg4az5vxa5-49pjkbzmgnjv8p7q6s4l2fgjx 192.168.43.8:2377

- Add `sudo` and run this command in our worker machines, we will get the output - `This node joined as a worker`

- We can verify the above by running below command in our manager machine - 

    sudo docker node ls

- Now run below command in the project directory on the manager machine - 

    sudo docker stack deploy -c docker-compose.yml reddit-demo


## API 

 - Open Postman
 - Import the `RedditDemo.postman_collection.json`
 - All the APIs will be available for usage.
 