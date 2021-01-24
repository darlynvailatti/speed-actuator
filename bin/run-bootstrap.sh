#!/bin/sh
echo "1) Building..."
build_bootstrap_bin=bin/build-bootstrap.sh
chmod +x $build_bootstrap_bin
./$build_bootstrap_bin

echo "2) Calling runners.."
echo "2.1) Starting REDIS..."
redis-server

echo "2.2) Starting SPEED-ACTUATOR..."
yarn start:prod