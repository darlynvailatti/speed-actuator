#!/bin/sh
echo "Building docker container image"
docker image build -t darlynvailatti/speedactuator .

echo "Calling docker-compose up..."
docker-compose up -d
