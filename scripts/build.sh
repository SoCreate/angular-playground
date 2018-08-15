#!/usr/bin/env bash

# build angular-playground package and link it globally
cd ./packages/angular-playground
npm run build
npm link

# link the angular-playground package in the cli example
cd ../../examples/cli-example
npm link angular-playground

echo 'finished setting up cli-example'
