#!/bin/sh
echo "1) Calling runners.."
echo "1.1) Starting REDIS..."
redis-server

echo "1.2) Starting SPEED-ACTUATOR..."
nohup yarn start:prod > speed-actuator.log &