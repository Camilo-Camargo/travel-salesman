#!/bin/sh
echo "Installing dependiencies"
yarn install

if [ $ENV = "prod" ]; then
  echo "------------ PRODUCTION MODE ------------"
  yarn build
  PORT=$APP_PORT yarn start
else
  echo "------------ DEVELOPMENT MODE ------------"
  PORT=$APP_PORT yarn dev
fi
