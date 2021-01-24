#!/bin/sh
echo "Building front-end..."
cd admin/front-end
yarn install
yarn build

echo "Building back-end..."
cd ../../
pwd
yarn install
yarn build