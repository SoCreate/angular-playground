# Angular Playground

A drop in app module for working on Angular components in isolation (aka Scenario Driven Development). 
Inspired by React Storybook.

> For Angular version 2.x and up

Visit <http://www.angularplayground.it> for setup and documentation.


## Working on the Angular Playground source code
### Initial setup
Install dependencies for the playground source code:
```
cd playground
npm i
```
Then install dependencies for the example-app:
```
cd ..
cd example-app
npm i
```
### Running the example app
From the `/example-app` dir:
```
npm run playground:fresh
```
From this point you can work on the Angular Playground `app` and `api` code,
but you will need to stop the playground from running and re-run it (which will
handle re-installing the latest changes for the package).
If you need to work on the `cli.ts` code you will need to 
run `npm run build` from the project root after your changes.
