#!/bin/sh
echo "Installing dependiencies"
yarn install

if [ $ENV = "prod" ]; then
  echo "------------ PRODUCTION MODE ------------"
  yarn build
  PORT=$API_PORT yarn start:prod
else
  echo "------------ DEVELOPMENT MODE ------------"
  PORT=$API_PORT yarn start
fi
