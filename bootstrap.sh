#!/bin/sh


while [ $# -gt 0 ]; do
  case "$1" in
    --environment=*)
     environment="${1#*=}"
    ;;
    *)
  esac
  shift
done


echo "Environemnt: "$environment

docker-compose up -d

echo "Building front-end..."
cd admin/front-end
yarn install
yarn build

echo "Building back-end..."
cd ../../
pwd
yarn install

if [ -z $environment ]; then
  npm run start
else
  npm run start:"$environment"
fi