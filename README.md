# Angular Playground

A drop in app module for working on Angular components in isolation (aka Scenario Driven Development). 
Inspired by React Storybook.

## Table of Contents
+ [Installing](#installing)
+ [Bootstrapping Angular Playground](#Bootstrapping-Angular-Playground)
+ [The Angular Playground CLI](#The-Angular-Playground-CLI)
+ [If your app is using Angular CLI](#If-your-app-is-using-Angular-CLI)
+ [Writing sandboxes for your components](#Writing-sandboxes-for-your-components)
+ [Working on the Angular Playground source code](#Working-on-the-Angular-Playground-source-code)

## Setup in your application project

<a name="installing"></a>
### Installing
Angular Playground is available as an npm package.
```
npm i -S angular-playground
```

<a name="Bootstrapping-Angular-Playground"></a>
### Bootstrapping Angular Playground
It is designed to use your existing app as a host for serving up an Angular Playground
application, which is nothing more than an Angular entry module that can be 
bootstrapped.

To bootstrap the playground, you can create an entry script with the following:

*main.playground.ts*
```typescript
import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground, PlaygroundModule } from 'angular-playground';

initializePlayground('ng-app');
platformBrowserDynamic().bootstrapModule(PlaygroundModule);
```

You can use your existing `index.html` and whatever other build/serve scenario you
have in place for you app, you just need to change your entry point to be this
`main.playground.ts` file instead of your `main.ts` file, or you could do some other
type of logic to run the `initializePlayground` and bootstrap the `PlaygroundModule` conditionally.

The `initializePlayground` function takes in an element selector string. The element 
selector is used to find your existing app element in your `index.html` DOM and 
replace it with the element selector used by the Angular Playground `AppComponent`.

<a name="The-Angular-Playground-CLI"></a>
### The Angular Playground CLI

Angular Playground is designed to find files in your existing app with 
the `.sandbox.ts` extension that use the Angular Playground API to set up sandboxes
of components. To do this auto-descovery the Angular Playground needs to 
create a static file on the fly (**sandboxes.ts**) to be able to have everything play nice with
Angular's module system. To do that, Angular Playground provides a cli!

The cli for the playground can be run with the command:  
```
angular-playground <config-file>
```

So, you will need a config file! Create an **angular-playground.json** file in 
your project (typically next to your package.json file) with the following content:  

*angular-playground.json*
```json
{
  "sourceRoot": "./src"
}
```
The `sourceRoot` value will be a path relative to the location of your **package.json**
file for your project. This will be the directory that will be looked at (it will go down recursively from there)
to find your **\*.sandbox.ts** files dynamically. It will also be the directory where the **sandboxes.ts**
file will get written to.

This means you will most likely want to add `sandboxes.ts` to your `.gitignore` file:
```
/src/sandboxes.ts
```

You will also want to set up a script in your `package.json` file to handle running the
cli command:
```json
{
  ... 
  "scripts": {
    ...
    "playground": "angular-playground angular-playground.json"
  }
  ... 
}
```

From there you can call:
```
npm run playground
```
This will build your `sandboxes.ts` file and will start a watch that will handle
re-running the file build as you modify/add files with the `*.sandbox.ts` extension
in your project.

Finally, all you need to do from here is to serve your application in a manner in which
your `initializePlayground` and bootstrap of the `PlaygroundModule` call will get run.

<a name="If-your-app-is-using-Angular-CLI"></a>
### If your app is using Angular CLI

Angular Playground ❤'s Angular CLI and has built in support for integrating with it.
If your app is using the **Angular CLI** you can set up your **angular-playground.json**
file to have Angular Playground make use of its `ng serve` under the hood.  

*angular-playground.json*
```json
{
  "sourceRoot": "./src",
  "angularCli": {
    "environment": "playground",
    "port": 4201
  }
}
```

When the `angularCli` property is present the `ng serve` command will be used when you 
run the `angular-playground` cli command. Below is a description of the properties of that
object:
+ `envionment` *(optional)*  
  The environment to target for serving up Angular Playground (will tell Angular CLI to use this instead of its default)
+ `port` *(optional)*  
  The port to tell `ng serve` to use. Defaults to `4201`.

You will most likely want to create a new environment file 
(see the [angular cli docs on GitHub](https://github.com/angular/angular-cli#build-targets-and-environment-files)
for the playground and make some changes to your existing `main.ts` file
and your existing environment files.

Starting with the new environment file for playground:

*environment.playground.ts*
```typescript
export { PlaygroundModule as AppModule } from 'angular-playground';
import { initializePlayground } from 'angular-playground';

export const environment = {
  production: false
};

initializePlayground('ng-app');

```

Here the code is exporting the `PlaygroundModule` as the type `AppModule`. This is going
to allow you to keep your `platformBrowserDynamic().bootstrapModule(AppModule)` call
in your `main.ts` the same. You need to do this because **AngularCLI** only
supports one entry script in the project. So you need a way to dynamically 
tell that script to bootstrap either your host app module or the playground module.

Then you need to call `initializePlayground()` and pass it in the selector string
for your `AppComponent`.

You will also need to update your existing `environment.*.ts` files to export
your `AppModule`. You should be able to do this by simply adding a line similar to:
```typescript
export { AppModule } from '../app/app.module';
```

Ok, then over in the entry point script:

*main.ts*
```typescript
import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment, AppModule } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
```

You need to change the `AppModule` import to come from `./environments/environment` 
instead of the typical `./app/app.module` and that's it!

With that, you have added support to the single `main.ts` file to bootstrap
different modules based on environment used.

<a name="Writing-sandboxes-for-your-components"></a>
## Writing sandboxes for your components

To create a sandbox with scenarios for components in your Angular application you need
to use the `sandboxOf` function and export the call to that as the default for the file.
This file needs to have the `.sandbox.ts` extension for it to be auto-discovered.

So let's say you have a `NoticeComponent` in a file named `notice.component.ts`.

*notice.component.ts*
```typescript
import { Component } from '@angular/core';
@Component({
  selector: 'app-notice',
  template: `<ng-content></ng-content>`
})
export class NoticeComponent {}
```

You can create a file next to it named `notice.component.sandbox.ts` with the following content:

*notice.component.sandbox.ts*
```typescript
import { sandboxOf } from 'angular-playground';
import { NoticeComponent } from './notice.component`;

export default sandboxOf(NoticeComponent)
  .add('with simple text', {
    template: `<app-notice>Hey playground!</app-notice>`
  });
```

The `sandboxOf` function returns an instance of a `SandboxBuilder` that has a fluid
api via it's `add` method. The `add` method is used to add scenarios for your sandboxed component.
Each scenario needs a `description` (the first parameter), and a `scenarioConfig` object
(the second parameter). The `scenarioConfig` object requires a `template` property at a minimum.

The `sandboxOf` function and `SandboxBuilder` are *"TypeScripted"* out so you can discover 
the different parameters/options/etc within your IDE/editor (if it has TypeScript support).
Or you can always explore the source code here! Or...you can contribute and add more docs to show
how to use the api. 😎

<a name="Working-on-the-Angular-Playground-source-code"></a>
## Working on the Angular Playground source code
### Initial setup
Install dependencies for the playground source code:
```
cd playground
npm i
```
FThen install dependencies for the example-app:
```
cd ..
cd example-app
npm i
```
### Running the example app
From the `/example-app` dir:
```
npm run playground
```
From this point you can work on the Angular Playground `app` and `api` code,
but you will need to stop the playground from running and re-run it (which will
handle re-installing the latest changes for the package).
If you need to work on the `cli.ts` code you will need to 
run `npm run build` from the project root after your changes.
