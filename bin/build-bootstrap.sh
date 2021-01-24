#!/bin/sh
echo "Building front-end..."
cd admin/front-end
npm install
npm run build

echo "Building back-end..."
cd ../../
pwd
npm install
npm run build