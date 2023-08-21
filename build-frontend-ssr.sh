#!/usr/bin/env bash

echo "Building Angular app for $NODE_ENV"

build_staging='sass --update apps/frontend/src/assets:apps/frontend/src/assets --no-source-map && ng build --configuration staging && ng run frontend:server:staging'
echo $build_staging
if [[ $NODE_ENV = "staging" ]]; then
 echo "running $build_staging ..."
 eval "$build_staging"
fi

build_prod='sass --update apps/frontend/src/assets:apps/frontend/src/assets --no-source-map && ng build --prod && ng run frontend:server:production'
echo $build_prod
if [[ $NODE_ENV = "production" ]]; then
 echo "running $build_prod ..."
 eval "$build_prod"
fi
