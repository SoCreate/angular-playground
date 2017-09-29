<a name="2.0.2"></a>
# 2.0.2 (2017-09-28)

### Fixes
* **package peer dependencies:** Fix issue with peer dependencies for 5.0.0-beta.0 and higher
  ([cd16815](https://github.com/SoCreate/angular-playground/commit/cd16815)) 


<a name="2.0.0"></a>
# 2.0.0 (2017-09-28)

### Requirements
* Requires Angular 4.2 or higher
* Requires Typescript version 2.4 or higher
* If using Angular CLI version 1.2 or higher is required
* Requires changing compilerOptions -> module property in "tsconfig.json" or "tsconfig.app.json" to use "esnext"

### Features
* **command bar:** New improved look to the command bar for navigating between 
  scenarios and components that have been sandboxed
* **perfomance:** Change the tool to now build an index of sandboxes and only 
  load a sandbox and its dependencies lazily when switching to that scenario
  with the command bar
* **labels:** Added a new way to differentiate sandboxes by giving them a specific
  label that is shown in the command bar for categorizing and can be used in search

### Fixes
* **command bar:** Fix edge browser keydown events
  ([8c54c41](https://github.com/SoCreate/angular-playground/commit/8c54c41)) 
* **examples:** Fix examples showing how to embed sandboxes
  ([8ac215c](https://github.com/SoCreate/angular-playground/commit/8ac215c))  
* **performance:** Change code to lazy load sandbox bundle when scenario is selected
  ([4bc33ff](https://github.com/SoCreate/angular-playground/commit/4bc33ff))  
* **performance:** Update build to create functions that lazy load sandboxes
  ([503c67b](https://github.com/SoCreate/angular-playground/commit/503c67b))  
* **command bar:** Change code to work with menu items index that was built from all 
  sandboxes to seperate the loading of components from listing what is available to 
  be loaded so that a sandboxes/related components are not loaded in one large bundle
  but instead each sandbox is independently bundled
  ([503c67b](https://github.com/SoCreate/angular-playground/commit/503c67b))  
* **performance:** Add new factory methods to get menu items/Remove combining of sandbox
  ([eb40a11](https://github.com/SoCreate/angular-playground/commit/eb40a11))  
* **performance:** Update build to create functions that lazy load sandboxes
  ([b4d241b](https://github.com/SoCreate/angular-playground/commit/b4d241b))  
* **command bar:** Update api to only deal with sandbox type information
  ([2a188de](https://github.com/SoCreate/angular-playground/commit/2a188de))  
* **typescript:** Update tsconfig to support using import function for lazy loading
  ([7e1ca6f](https://github.com/SoCreate/angular-playground/commit/7e1ca6f))  
* **package upgrades:** Update webpack example to newer version of angular 
  ([3fc808a](https://github.com/SoCreate/angular-playground/commit/3fc808a))  
* **style:** Change menu style
  ([49256d8](https://github.com/SoCreate/angular-playground/commit/49256d8))  
* **package upgrades:** Upgrade sample and dev cli projects to latest package versions  
  ([f3e970f](https://github.com/SoCreate/angular-playground/commit/f3e970f))  
 
 ### Breaking Changes
* **component scenario combining removed:** Each sandbox will now uniquely show up as 
  its own section in the command bar even if it is sandboxing the same component
* **embed url:** Embed url has now changed to uniquely reference the sandbox file
  based on the path within the application

  Before:
  ```html
  <a href="http://localhost:4201/?scenario=feature1.PersonBioComponent/a%20special%20case">View in Playground</a>
  <iframe src="http://localhost:4201/?scenario=feature1.PersonBioComponent/a%20special%20case&embed=1" frameborder="0" width="100%"></iframe>
  ```

  After:
  ```html
  <a href="http://localhost:4201/?scenario=.%2Fapp%2Ffeature1%2Fperson-bio.component.other.sandbox/a%20special%20case">View in Playground</a>
  <iframe src="http://localhost:4201/?scenario=.%2Fapp%2Ffeature1%2Fperson-bio.component.other.sandbox/a%20special%20case&embed=1" frameborder="0" width="100%"></iframe>
  ```

* **api:** Rename prependText property to label
  ([05b6bba](https://github.com/SoCreate/angular-playground/commit/05b6bba)) 

  Before:
  ```typescript
  import {sandboxOf} from 'angular-playground';
  import {PersonBioComponent} from './person-bio.component';
  export default sandboxOf(PersonBioComponent, {prependText:'feature1.'})
    .add('a special case', {template:`<h1>Special Bio</h1><ex-person-bio></ex-person-bio>`});
  ```

  After:
  ```typescript
  import {sandboxOf} from 'angular-playground';
  import {PersonBioComponent} from './person-bio.component';
  export default sandboxOf(PersonBioComponent, {label:'feature1'})
    .add('a special case', {template:`<h1>Special Bio</h1><ex-person-bio></ex-person-bio>`});
  ```
 
* **typescript configuration:** In order to lazy load sandboxes for components the
  new version requires that the compilerOptions -> module option in the tsconfig file
  be set to "esnext"

  Before:
  ```json
  {
    "extends": "../tsconfig.json",
    "compilerOptions": {
      "outDir": "../out-tsc/app",
      "baseUrl": "./",
      "module": "es2015",
      "types": []
    },
    "exclude": [
      "test.ts",
      "**/*.spec.ts"
    ]
  }
  ```

  After:
  ```json
  {
    "extends": "../tsconfig.json",
    "compilerOptions": {
      "outDir": "../out-tsc/app",
      "baseUrl": "./",
      "module": "esnext",
      "types": []
    },
    "exclude": [
      "test.ts",
      "**/*.spec.ts"
    ]
  }
  ```

  
<a name="1.7.1"></a>
# 1.7.1 (2017-08-21)

### Fixes
* **style:** Remove section and :host styles that force bgcolor and font  
  ([c82bb4c](https://github.com/SoCreate/angular-playground/commit/c82bb4c))  
* **tslint:** Add missing newline to last string in StringBuilder array  
  ([814c161](https://github.com/SoCreate/angular-playground/commit/814c161))  
* **tslint:** Fix tslint configuration  
  ([4a5116b](https://github.com/SoCreate/angular-playground/commit/4a5116b))  
  
  

<a name="1.7.0"></a>
# 1.7.0 (2017-06-22)

### Features
* **root NgModule customization:** Created a `PlaygroundCommonModule` that can
  be imported into your own root NgModule in cases where you need to import, provide,
  etc other things at the root level for the Playground app.  
  ([1e266cf](https://github.com/SoCreate/angular-playground/commit/1e266cf))  

### Fixes
* **z-index:** Removed z-index on `section` element as it was not needed  
  ([d4d3dcf](https://github.com/SoCreate/angular-playground/commit/d4d3dcf))  
* **dist:** Updated build to use `ngc` and removed delivery of `*.ts` files  
  ([d64ebf3](https://github.com/SoCreate/angular-playground/commit/d64ebf3))  
  
### Misc
* **example app cli:** Upgraded the AngularCLI version in the example app to 1.1.3

### Breaking Changes
* **removal of `BrowserAnimationsModule` auto-import:** Deleted the code in the 
  Playground CLI that auto added the `BrowserAnimationsModule` to the root NgModule
  imports. This should now be done by you in a custom root NgModule that you create
  and have total control over. If you were using Playground and had sandboxed components
  that were relying on `BrowserAnimationsModule` then you will want to create a NgModule
  for Playground in your app and use the `PlaygroundCommonModule` and bootstrap the 
  Playground `AppComponent`. Example:
  
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, PlaygroundCommonModule } from 'angular-playground';
  
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PlaygroundCommonModule
  ],
  bootstrap: [AppComponent]
})
export class MyPlaygroundModule {}
```


<a name="1.6.0"></a>
# 1.6.0 (2017-04-13)

### Features
* **command bar:** Added up arrow support from command bar text box
  ([63fbea1](https://github.com/SoCreate/angular-playground/commit/63fbea1))  
* **command bar:** Added F1 as supported Key to open Command Bar
  ([d79adaa](https://github.com/SoCreate/angular-playground/commit/d79adaa))  
* **command bar:** Added example of inline component in sandbox file
  ([bcd4214](https://github.com/SoCreate/angular-playground/commit/bcd4214))  

### Fixes
* **cli:** Added support for production build minification
  ([4aecc19](https://github.com/SoCreate/angular-playground/commit/4aecc19))  


<a name="1.5.3"></a>
# 1.5.3 (2017-04-11)

### Fixes
* **app:** Updated to support clearing url when no sandbox or scenario key is matched (helps when you live edit
  a `.sandbox.ts` file and change the sandboxed item type or scenario description).

<a name="1.5.2"></a>
# 1.5.2 (2017-04-03)

### Fixes
* **angular animations:** Added support to auto-discover if your project is using `@angular/animations` and 
  if it is, add the import of the `BrowserAnimationsModule` in the root `PlaygroundModule`  so Playground will support
  components in your app that use animations.

<a name="1.5.1"></a>
# 1.5.1 (2017-03-30)

### Fixes
* **angular cli:** Fix support for `args` in `angular-playground.json` to be able to pass
  additional arguments through to the `ng serve` command that is auto-run by Playground when
  integrating with the Angular CLI.
  
  before: 
  ```json
  {
    "sourceRoot": "./src",
    "angularCli": {
      . . .
      "args": "--ssl --open"
    }
  }
  ```
  after:
  ```json
  {
    "sourceRoot": "./src",
    "angularCli": {
      . . .
      "args": ["--ssl", "--open", "--host=0.0.0.0"]
    }
  }
  ```

<a name="1.5.0"></a>
# 1.5.0 (2017-03-27)

### Features
* **angular cli:** Add support for `args` in `angular-playground.json` to be able to pass
  additional arguments through to the `ng serve` command that is auto-run by Playground when
  integrating with the Angular CLI.
  
  ```json
  {
    "sourceRoot": "./src",
    "angularCli": {
      . . .
      "args": "--ssl --open"
    }
  }
  ```

<a name="1.4.1"></a>
# 1.4.1 (2017-03-23)

### Fixes
* **command bar:** Add styles for stacking order to keep command bar on top of content in all cases.  
  ([#20](https://github.com/SoCreate/angular-playground/pull/20))  
  ([7638146](https://github.com/SoCreate/angular-playground/commit/7638146))

<a name="1.4.0"></a>
# 1.4.0 (2017-03-01)

### Features
* **api:** Add `declareComponent` flag to `SandboxConfig` that controls whether the sandbox component is declared automatically - defaults to true  
  ([#15](https://github.com/SoCreate/angular-playground/issues/15))  
  ([74886d2](https://github.com/SoCreate/angular-playground/commit/74886d2))


<a name="1.3.2"></a>
# 1.3.2 (2017-03-01)

### Fixes
* **build:** Add declare of `require` type in `load-sandboxes.ts` to fix TypeScript transpile error.

<a name="1.3.1"></a>
# 1.3.1 (2017-03-01)

### Fixes
* **cli:** Add source files to build for distribution to fix issue with Angular CLI first build throwing error  
  ([#14](https://github.com/SoCreate/angular-playground/issues/14))  
  ([1cd125d](https://github.com/SoCreate/angular-playground/commit/1cd125d))
* **build:** Add typings throughout source files to support environments using `noImplicitAny`.

<a name="1.3.0"></a>
# 1.3.0 (2017-02-27)

### Features
* **Angular CLI:** Added support for `@angular/cli@1.0.0-rc.0`. You can now make use of the multi-app support in Angular CLI
  to create a "playground" app with a unique entry script. See docs at <http://angularplayground.it> for more info.

* **Angular v4.x:** Changed some interal code of Playground app so it can be compatable with Angular `4.0.0-rc.1` and above.


<a name="1.2.1"></a>
# 1.2.1 (2017-02-21)

### Features
* **cli flags:** Added support for the following flags when running `angular-playground` 
  *(these are designed to be used in the case where you want to integrate the call to the Playground CLI into
  a build process for an instance of the Playground)*:
  * `-no-watch` Tells cli to not watch for `*.sandbox.ts` file changes.
  * `-no-serve` Tells cli to not run `ng serve` if the Playground is set up to integrate with Angular CLI.

* **cli config:** Added auto-discovery of `angular-playground.json` file next to `project.json` file if exists,
so you can call `angular-playground` with no args and it will do the auto-discovery.


<a name="1.2.0"></a>
# 1.2.0 (2017-02-17)

### Features
* **state in url:** The selected component scenario now gets added as a query string to the URL instead
of storing that info in session storage. This allows for **deep linking**.

* **deep linking:** A running Playground app now supports a query string parameter for deep linking 
directly to a component scenario.
  ```
  ?scenario=[prependText][componentName]/[scenarioDescription]
  ```
  You can get a hold of this link by pulling up a component scenario in the Playground and getting
  the link from the browser location bar.
  
* **embed mode:** A running Playground app now supports a query string parameter to put the
render into embed mode (just the component scenario, no command bar support).
  ```
  ?scenario=[prependText][componentName]/[scenarioDescription]&embed=1
  ```
  This is the same as the deep link but with an added query string parameter of `embed=1`.  
  So an example might look like `?scenario=feature1.NoticeComponent/with%20long%20text&embed=1` and you could use it
  within another app/page via an iframe:
  ```html
  <iframe src="http://yourplaygroundhost?scenario=feature1.NoticeComponent/with%20long%20text&embed=1"></iframe>
  ```

* **multi file for same component:** Added support for identifying `sandboxOf` calls on the same component
type and grouping them in the command bar when the combo of `prependText` and `componentType` are the same.
Now you can have multiple `*.sandbox.ts` files to sandbox the same component and the scenarios can fall under
the same grouping in the command bar.

* **fuzzy search:** Added fuzzy search support to the command bar (big thank you to [Nicolás Bevacqua](https://twitter.com/nzgb) for 
 his open source [fuzzySearch](https://github.com/bevacqua/fuzzysearch) code!).

### Notes
* **Angular CLI integration:** As of `1.0.0-beta.31` and above the integration code to run Playground with
Angular CLI is not working. There will be an update when the Angular CLI goes to `RC0` (which should 
hopefully be soon). In the meantime, if you want to use Playground in an Angular CLI app you need to 
stay on `1.0.0-beta.30` or you can make use of the webpack eject command in `1.0.0-beta.32`.

<a name="1.1.8"></a>
# 1.1.8  (2017-02-11)

### Fixes
* **build** Added `any[]` type to `sandboxes` variable to support environments using `noImplicitAny` for their TypeScript builds.
* **app** Added z-index for command bar to always overlay even if sandboxed components contain absolute positioned content.
([#6](https://github.com/SoCreate/angular-playground/issues/6))
([3c258de](https://github.com/SoCreate/angular-playground/commit/3c258de))

### Notes

* **example apps** The source code for angular-playground now has an example app using webpack.


<a name="1.1.7"></a>
# 1.1.7  (2017-02-02)

### Fixes

* **build:** Added newLine compiler option to force LF for tsc
([#3](https://github.com/socreate/angular-playground/issues/3))
([bd90e84](https://github.com/SoCreate/angular-playground/commit/bd90e84))

### Notes

* **angular-cli:** **@ngtools/webpack** (1.2.7) is out and fixes
the error on rebuild so no need to pin that package anymore!


<a name="1.1.6"></a>
# 1.1.6  (2017-02-02)

### Features

* **angular-cli:** Added support for **Angular CLI** package name change to @angular/cli 
([#4](https://github.com/socreate/angular-playground/issues/4))
([767f48e](https://github.com/SoCreate/angular-playground/commit/767f48e))

### Notes

* **angular-cli:** The new version of **@ngtools/webpack** (1.2.5) throws an error on
rebuild. You can temporarily get around this by doing a `npm i @ngtools/webpack@1.2.4`. It
looks like the issue is being tracked [here](https://github.com/angular/angular-cli/issues/4353)
and hopefully will get a fix.
