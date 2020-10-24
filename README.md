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

```sudo apt-get install build-essential libffi-dev python-dev```

- [MONGODB](https://docs.mongodb.com/manual/installation/) - Our Database

- [REDIS](https://redis.io/download#installation) - Our Messaging System

- As the system requires docker for launch, follow below links for installation - 

    - [Docker-Engine](https://docs.docker.com/engine/install/ubuntu/)
    - [Docker-Compose](https://docs.docker.com/compose/install/)
    - [Docker-machine](https://docs.docker.com/machine/install-machine/)

- On our worker machine install docker.io

```sudo apt install docker.io```

- [Postman](https://www.postman.com/downloads/)

## Launch

Open Project Repository in terminal - 

- Latest image building and initial local check

```
sudo chmod +x docker.sh
sudo ./docker.sh
```

- Once the above had built all images and finished launching. Use `localhost:3000` for our test the API endpoints provided below

## Launching the Swarm Cluster

- Ready all our manager and worker machines.

- In the manager machine, run below code - 

```sudo docker swarm init --advertise-addr 192.168.43.8```

- The IP address provided will be our gateway for accessing the project.

- Running the above command will output a command for joining the swarm like below - 

```docker swarm join --token SWMTKN-1-4ptrecnw57hpysjo8eo9r2ye7dr6dnzv953fm3kewg4az5vxa5-49pjkbzmgnjv8p7q6s4l2fgjx 192.168.43.8:2377```

- Add `sudo` and run this command in our worker machines, we will get the output - `This node joined as a worker`

- We can verify the above by running below command in our manager machine - 

```sudo docker node ls```

- Now run below command in the project directory on the manager machine - 

```sudo docker stack deploy -c docker-stack.yml --with-registry-auth reddit-demo```

- Run below command to list service names -

```sudo docker service ls```

- Run below commands to see the distribution of services across nodes

```sudo docker service ps 'servicename1' 'servicename2' --format 'table {{.ID}}\t{{.Name}}\t{{.Node}}'```

- We will get an output like below

```
ID                  NAME                      NODE
oc8eczare6wv        reddit-demo_app.1         manager
u3mz2zgn085a         \_ reddit-demo_app.1     worker2
afdgmos1hbyh         \_ reddit-demo_app.1     worker1
tou3u1t26vk5        reddit-demo_micro.1       manager
wo142yj90hbs         \_ reddit-demo_micro.1   worker1
feuc5ymz3jn7         \_ reddit-demo_micro.1   worker1
fstbz8kthp5l        reddit-demo_mongodb.1     worker3
951docut0zav        reddit-demo_redisdb.1     manager
```

## API 

 - Open Postman
 - Import the `RedditDemo.postman_collection.json`

## API Documentation

 - API Documentation will be available at the below url using Swagger

     - http://localhost:3000/documentation

 - Otherwise API description is also available in the postman collection.
 

## To Be Worked on Usage of private registry.

```
sudo docker pull registry:2

sudo docker run -d -p 5000:5000 --restart=always --name registry registry:2

sudo docker ps 
```