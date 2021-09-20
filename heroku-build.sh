#!/usr/bin/env bash

echo "Building Angular app for $NODE_ENV"

build_staging='ng build --configuration staging && ng run frontend:server:staging'
if [[ $NODE_ENV = "staging" ]]; then
 echo "running $build_staging ..."
 eval "$build_staging"
fi

build_prod='ng build --prod && ng run frontend:server:production'
if [[ $NODE_ENV = "production" ]]; then
 echo "running $build_prod ..."
 eval "$build_prod"
fi
