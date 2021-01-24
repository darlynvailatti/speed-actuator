#!/bin/sh
echo "Building back-end..."
yarn install
yarn build

echo "Building front-end..."
cd admin/front-end
yarn install
yarn build

