#!/usr/bin/env bash

# TODO: This isn't currently being used, but this bash script run the correct build based on the environment type in the heroku-postbuild hook

echo "Building Angular app for $NODE_ENV"

build_dev='ng build --dev && ng run frontend:server:dev'
if [ $NODE_ENV = "development" ]; then
 echo "running $build_dev ..."
 eval "$build_dev"
fi

build_prod='ng build --prod && ng run frontend:server:production'
if [ $NODE_ENV = "production" ]; then
 echo "running $build_prod ..."
 eval "$build_prod"
f
