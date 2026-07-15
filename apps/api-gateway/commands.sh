# Build the image
docker build -f apps/api-gateway/Dockerfile -t fota-api-gateway:latest .

# Remove the current container
docker rm -f api-gateway

# Start interactively using a shell entrypoint override
docker run -it --name api-gateway -p 3030:3030 --env-file ".env" --entrypoint /bin/sh fota-api-gateway:latest

# Start container
docker run -d --name api-gateway -p 3030:3030 --env-file ".env" fota-api-gateway:latest
docker run -d --name api-gateway -p 3030:3030 --env-file ".env" fota-api-gateway:latest

docker logs -f api-gateway

docker exec -it api-gateway sh

# Inspect the Filesystem of the Crashed Container
docker run --rm -it --entrypoint sh fota-api-gateway:latest

docker start api-gateway

docker exec -u root -it api-gateway bash

# force a clean rebuild without using cached layers
docker build --no-cache -f apps/api-gateway/Dockerfile -t fota-api-gateway:latest .
