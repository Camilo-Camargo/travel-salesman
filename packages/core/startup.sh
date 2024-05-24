#!/bin/sh
echo "Installing dependiencies"
apk add musl-dev
cargo fetch
if [ $ENV = "prod" ]; then
  echo "------------ PRODUCTION MODE ------------"
  cargo run
else
  echo "------------ DEVELOPMENT MODE ------------"
  cargo install cargo-watch
  cargo watch -x 'run'
fi
