# 5.8.3 (2019-6-19)

<a name="5.8.3"></a>

### Bug Fixes
* **visual regressions:** Fix issue with screenshot capturing loading image
* **visual regressions:** Fix issue with some tests timing out

# 5.8.2 (2019-6-15)

<a name="5.8.2"></a>

### Bug Fixes
* **visual regressions:** Make jest not ignore the `test.js` file used for testing visual regressions

# 5.8.1 (2019-6-14)

<a name="5.8.1"></a>

### Bug Fixes
* **visual regressions:** Include jest config files needed for testing visual regressions

# 5.8.0 (2019-6-14)

<a name="5.8.0"></a>

### Features
* **config:** Add option to check for visual regressions

# 5.7.0 (2019-6-5)

<a name="5.7.0"></a>

### Features
* **config:** Add option to configure host that ng serve runs on (default is 127.0.0.1)

### Bug Fixes
* **config:** Add default file path for check errors output file (only for json/xml, not log)

# 5.6.0 (2019-6-5)

<a name="5.6.0"></a>

### Features
* **angular:** Upgrade to be compatible with Angular version 8

### Bug Fixes
* **error reporter:** Fixed error reporter sometimes having blank errors

# 5.5.0 (2019-5-10)

<a name="5.5.0"></a>

### Features
* **config:** Playground now supports using multiple source libraries at once (via the `sourceRoots` property in the configuration)

# 5.4.4 (2019-5-10)

<a name="5.4.4"></a>

### Bug Fixes
* **cli schematics:** Fixed schematic pathing issues for apps not created with the default `ng new <appName>` command

# 5.4.3 (2019-4-5)

<a name="5.4.3"></a>

### Bug Fixes
* **error reporter:** Fixed finding a free port

# 5.4.2 (2019-4-2)

<a name="5.4.2"></a>

### Bug Fixes
* **error reporter:** Fixed not xml encoding some strings for the xml report

# 5.4.1 (2019-4-1)

<a name="5.4.1"></a>

### Bug Fixes
* **error reporter:** Fixed not generating a report when there were no errors

# 5.4.0 (2019-3-19)

<a name="5.4.0"></a>

### Features
* **error reporter:** Added a new error reporter for JUnit XML format

# 5.3.1 (2019-3-18)

<a name="5.3.1"></a>

### Features
* **perf:** Performance optimizations to verify sandboxes

### Bug Fixes
* **cli:** Fixed CLI configuration options for verify sandboxes
* **types:** Improved types for verify sandboxes

# 5.3.0 (2019-1-18)

<a name="5.3.0"></a>

### Features
* **npm dependencies:** Update npm dependencies and peer dependencies

# 5.2.0 (2018-11-15)

### Features
* **configuration:** Users can now set the max buffer size for the internal angular cli commands

### Kudos
* Thanks to **@paolocarrasco** for the contributions towards this release!

# 5.1.5 (2018-10-18)

<a name="5.1.5"></a>

### Bug Fixes
* **ng add:** Fix ng add schematic error caused styles in the angular.json file using the new [object format](https://github.com/angular/angular-cli/wiki/stories-global-styles#global-styles).

# 5.1.4 (2018-10-17)

<a name="5.1.4"></a>

### Bug Fixes
* **ng add:** Fix ng add schematic adding 2 entries to the package.json file.
* **ng add:** Fix incorrect assets path when creating playground entry in angular.json.
* **playground:** Improved message on playground home screen when there are no sandboxed components.

### Kudos
* Thanks to **@Halt001** for the contributions towards this release!

# 5.1.3 (2018-08-23)

<a name="5.1.3"></a>

### Bug Fixes
* **generate sandbox:** Fixed relative import of sandboxed component when using the sandbox generate command.

# 5.1.2 (2018-08-22)

<a name="5.1.2"></a>

### Bug Fixes
* **npm run playground:** Fixed error where the playground would crash on startup.

# 5.1.1 (2018-08-22)

<a name="5.1.1"></a>

### Bug Fixes
* **ng add:** Fixed error when installing via the `ng add` command.

# 5.1.0 (2018-08-21)

<a name="5.1.0"></a>

### Features
* **update sandbox config:** Add new `entryComponents` and `schemas` options for use when dynamically creating a module containing the dependencies of a `Sandbox` ([5f91c7f](https://github.com/SoCreate/angular-playground/commit/5f91c7f)).
* **add cli schematics:** Add the ability to install `angular-playground` with `ng add`.
* **add sandbox schematics:** Add the ability to create a new sandbox file with an ng cli command.

### Bug Fixes
* **natives package:** Updated `natives` npm package to fix gulp issue on windows running node 10+.
* **local development:** Fixed several bugs with local development environment that caused the sandbox to crash when built and run locally.

### Kudos
* Thanks to **@sulco** for the contributions towards this release!

# 5.0.1 (2018-05-31)

<a name="5.0.1"></a>

### Bug Fixes
* **fix sandbox file watch:** Fix issue with sandbox files not getting compiled when new one is added or removed.

# 5.0.0 (2018-05-18)

<a name="5.0.0"></a>

### Features
* **compatible with version 6:** Updated Angular Playground to be work with Angular 6 and Angular CLI 6.
           
### Breaking Changes

* **angular cli setup configuration changes**: The Angular CLI uses a new configuration file "angular.json" that is now based on projects as instead of apps.  When upgrading to use Angular CLI 6 change the "angular.json" file to include the contents of the after shown below.
            

  Before:

  .angular-cli.json
  ```
  {
  . . .
  
  "apps": [

    . . .

    {
      "name": "playground",
      "root": "src",
      "outDir": "dist-playground",
      "assets": [
        "assets",
        "favicon.ico"
      ],
      "index": "index.html",
      "main": "main.playground.ts",
      "polyfills": "polyfills.ts",
      "tsconfig": "tsconfig.app.json",
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
   ],

   . . .
  }
  ```
  After:

  angular.json
  ```
  {
  . . .

  "projects": {

    . . .

    "playground": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/playground",
            "index": "src/index.html",
            "main": "src/main.playground.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": false
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "playground:build"
          }
        }
      }
    }
  },

   . . .
  }
  ```

* **removed environment configuration**: Remove support for setting environment configuration in angular-playground.json file. Also removed command line switch for environment "--ng-cli-env".  You can now just configure environment settings directly in the angular.json file and just provide different configurations.


# 4.0.1 (2018-04-23)

<a name="4.0.1"></a>

### Bug Fixes
* **app:** Fixed issue with matching sandbox metadata when formatted differently ([aa9285a](https://github.com/SoCreate/angular-playground/commit/aa9285a)).

# 4.0.0 (2018-03-15)

<a name="4.0.0"></a>

### Features
* **Plugins and Configuration:** A new plugin/configuration API allows developers to easily configure and provide
           modules to the Playground application. This is a feature that we're especially excited about at
           SoCreate and plan on extending the functionality further based on what type of plugins people would
           like to develop. Right now, the plugin system provides a wrapper around distributing modules to all
           sandboxes globally and enabling a command-bar overlay ([1db080f](https://github.com/SoCreate/angular-playground/commit/1db080f))
           
  When declaring the Playground entry point in `main.playground.ts`, use `PlaygroundModule` to provide configuration:
  ```typescript
  // main.playground.ts
  PlaygroundModule
    .configure({
      // Application's root selector for initialization
      selector: 'app-root',
      // Register modules that are available to all sandboxes
      modules: [
        BrowserAnimationsModule,
        environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
      ],
      // Enable an overlay UI for access to the command bar in mobile/ipad
      overlay: true
    })

  
  platformBrowserDynamic().bootstrapModule(PlaygroundModule)
    .catch(err => console.error(err));
  ```
  
  **Note**: this new Configuration API replaces the existing "root module" syntax for providing application-wide modules
            (like the BrowserAnimation module):

  **Deprecated syntax:**
  ```typescript
  // my-playground.module.ts
  @NgModule({
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      // etc.
    ]
  })
  export class MyPlaygroundModule {}

  // main.playground.ts
  // Don't do this, always use PlaygroundModule:
  platformBrowserDynamic().bootstrapModule(MyPlaygroundModule);
  ```
  
  **Don't call initializePlayground() directly anymore**
  ```typescript
  // main.playground.ts
  // no longer needed:
  initializePlayground('app-root')
  
  // instead:
  PlaygroundModule
    .configure({
      selector: 'app-root'
    });
  ```

* **app:** Added an opt-in overlay that allows users to open the command bar via click/touch. To enable this, use the
        `PlaygroundModule.configure({ overlay: true })` option (see above for code example) ([f047453](https://github.com/SoCreate/angular-playground/commit/f047453)).
* **cli:** Added base-href support for production builds. This works in the same way as @angular/cli's `ng build --base-href` command does.
        Pass it in when running a build: ([0af9fbc](https://github.com/SoCreate/angular-playground/commit/0af9fbc))
  ```
  angular-playground --build --base-href=my/path/to
  ```

### Bug Fixes
* **app:** Fixed IE11 build due to ES2015 arrow functions ([0609340](https://github.com/SoCreate/angular-playground/commit/0609340)).
* **app:** Fixed IE11 command bar appearing on pages after being closed ([8e0f099](https://github.com/SoCreate/angular-playground/commit/8e0f099)).
* **app:** Switched the "quick switch" key to `control` from `alt` for firefox compatibility
           ([8b5b386](https://github.com/SoCreate/angular-playground/commit/8b5b386)).
* **cli:** Better error reporting due to properly surfacing errors and exiting the CLI process ([53692cc](https://github.com/SoCreate/angular-playground/commit/53692cc)).

### Kudos
* Thanks to **@pharaxe**, **@cvidal**, and **@michaeljfuller** for their contributions towards this release!

# 3.4.0 (2018-01-11)

<a name="3.4.0"></a>

### Features
* **cli:** You can now build Playground apps for production with service workers 
           ([cf38864](https://github.com/SoCreate/angular-playground/pull/81/commits/cf38864)).

  Use the `--build` flag to build Playground for production. Note that this requires all of the same setup
  to enable Service Workers as outlined by the Angular CLI--see [our docs](http://angularplayground.it/docs/how-to/build-prod)
  for more details.

# 3.3.0 (2018-01-09)

<a name="3.3.0"></a>

### Maintenance
* Regrouped source into `packages/`, supporting infrastructure for multiple exported projects (preparation for
  @angular/cli schematics) ([083a83f](https://github.com/SoCreate/angular-playground/commit/083a83f)).
* Introduced infrastructure for unit tests with Jest. More unit tests will be gradually added to the project in future releases,
  making up for the present lack of test coverage ([28e4755](https://github.com/SoCreate/angular-playground/commit/28e4755)).
* Refactored CLI for unit testability ([69cc522](https://github.com/SoCreate/angular-playground/commit/69cc522)).

### Bug Fixes
* **check-errors:** Fixed issue where sandbox verification wasn't properly reading from the `sandboxes.js` file
                    due to `esnext` dyanmic import module syntax
                    ([cd9f18c](https://github.com/SoCreate/angular-playground/commit/cd9f18c)).

# 3.2.0 (2018-01-04)

<a name="3.2.0"></a>

### Features
* **cli:** Added an option to disable sandbox chunking for apps with a large number of sandbox files.

  Usage:
  ```
  angular-playground --no-chunk
  ```

# 3.1.0 (2018-01-03)

<a name="3.1.0"></a>

### Bug Fixes
* **sandboxes.ts:** The `sandboxes.ts` file is no longer generated in the root of the consuming application's
                    project. Instead, `sandboxes.ts` is modified and referenced entirely within
                    `angular-playground` ([1fda77f](https://github.com/SoCreate/angular-playground/commit/1fda77f)).
* **sandbox chunking:** Sandbox scenarios are individually chunked and loaded, meaning that your
                        component sandboxes are once again truly isolated. This functionality
                        was affected by the `@angular/cli` 1.6.2 update
                        ([1fda77f](https://github.com/SoCreate/angular-playground/commit/1fda77f)).

  Before we had you change `tsconfig.app.json` to use `esnext` modules:
  ```
  # tsconfig.app.json
  {
    ...
    "module": "esnext"
  }
  ```

  Now there's no need to change it from the Angular CLI's default:
  ```
  # tsconfig.app.json
  {
    ...
    "module": "es2015"
  }
  ```

<a name="3.0.0"></a>

# 3.0.0 (2017-12-01)

### Features
* **cli:** Added a boat-load of new CLI configuration options. Every option available
           in the `angular-playground.json` file is now also available as a CLI argument
           (except @angular/cli arguments). [Read more about it in our docs](http://angularplayground.it/docs/api/configuration).
           ([9dc1066](https://github.com/SoCreate/angular-playground/commit/9dc1066))
* **new docs:** Speaking of docs, check out our newly-designed
           [docs page](http://angularplayground.it/docs/getting-started/introduction).
* **new error checking utility:** A new CLI option has been introduced that will run and visit
           all sandbox scenarios in headless chrome, surfacing any errors that appear in the
           console. [Never forget to mock a dependency again!](http://angularplayground.it/docs/how-to/run-the-test-suite)
           ([6074586](https://github.com/SoCreate/angular-playground/commit/6074586))
* **report formats for builds:** Used in conjunction with the checking utility, you can now
           generate a JSON report that your build system can read for error reporting. Read all
           about it [here](http://angularplayground.it/docs/api/reporter-formats).
           ([7e0f5a8](https://github.com/SoCreate/angular-playground/commit/7e0f5a8))

* **command bar shows all components as default:** Got the Playground running but don't know where
           to begin? We'll help you out by showing all of your available scenarios.
           ([51680fd](https://github.com/SoCreate/angular-playground/commit/51680fd)

### Breaking Changes
* **no default configuration argument**: The CLI no longer supports a default configuration file argument.
            **Note:** `angular-playground` with no arguments will still default to using the
            `angular-playground.json` file as expected.
            ([9dc1066](https://github.com/SoCreate/angular-playground/commit/9dc1066))

  Before:
  ```
  angular-playground my-configuration-file.json
  ```
  After:
  ```
  angular-playground --config my-configuration-file.json
  ```

* **new cli argument style**: CLI arguments now match typical npm style: `--argument` for full name, `-A` for abbreviation.

  Before:
  ```
  -no-watch -no-serve
  ``` 

  After:
  ```
  --no-watch --no-serve
  ```

<a name="2.3.0"></a>
# 2.3.0 (2017-11-13)

### Features
* **keyboard shortcuts:** Change dropdown keybindings to f2 and ctrl+p
  ([8b8dd84](https://github.com/SoCreate/angular-playground/commit/8b8dd84))
* **update angular:** Update to 5.0.0 release
  ([841984b](https://github.com/SoCreate/angular-playground/commit/841984b))


<a name="2.2.0"></a>
# 2.2.0 (2017-10-08)

### Features
* **style:** Add styles for scrollbar in chrome
  ([c6a406f](https://github.com/SoCreate/angular-playground/commit/c6a406f))
* **style:** Change style of shortcuts on home page
  ([c61044d](https://github.com/SoCreate/angular-playground/commit/c61044d))
* **style:** Add shortcuts list to initial view
  ([686e87d](https://github.com/SoCreate/angular-playground/commit/686e87d))
* **style:** Add style for highlighted search terms
  ([6d2224c](https://github.com/SoCreate/angular-playground/commit/6d2224c))
* **search:** Add highlight feature to the search to show which fuzzy characters have matched
  ([134940c](https://github.com/SoCreate/angular-playground/commit/134940c))
* **style:** Reduce opacity on entire command bar in preview mode instead of just the background
  ([8de2840](https://github.com/SoCreate/angular-playground/commit/8de2840))
* **style:** Pass through proper keydown event and adjust styles on the command bar preview mode
  ([213a854](https://github.com/SoCreate/angular-playground/commit/213a854))
* **style:** Add transparency to command bar when holding the alt key
  ([d505810](https://github.com/SoCreate/angular-playground/commit/d505810))


<a name="2.1.0"></a>
# 2.1.0 (2017-10-02)

### Features
* **menu bar navigation:** Add new preview feature to show scenarios when holding the alt key and using the up and down arrow keys
  ([1e34464](https://github.com/SoCreate/angular-playground/commit/1e34464)) 
* **search:** Change fuzzy search to improve accuracy of search results
  ([6e8c57f](https://github.com/SoCreate/angular-playground/commit/6e8c57f)) 

### Fixes
* **menu bar navigation:** Change moving up or down in the menu with arrow keys when 
scenario is selected to go right to the previous or next item
  ([53ceed4](https://github.com/SoCreate/angular-playground/commit/53ceed4)) 
* **embedding:** Fix issue with filter filled out with key path when using url in new browser tab
  ([c37649c](https://github.com/SoCreate/angular-playground/commit/c37649c)) 

<a name="2.0.4"></a>
# 2.0.4 (2017-09-29)

### Fixes
* **embedding:** Fix issues with embed mode
  ([dff2962](https://github.com/SoCreate/angular-playground/commit/dff2962)) 

<a name="2.0.3"></a>
# 2.0.3 (2017-09-29)

### Fixes
* **style:** Change the initial none message to be centered without affecting sandboxed component displays
  ([37e9433](https://github.com/SoCreate/angular-playground/commit/37e9433)) 
* **style:** Set command bar to show hide with css to maintain scroll position
  ([f7a3cc9](https://github.com/SoCreate/angular-playground/commit/f7a3cc9)) 
* **style:** Prevent list item headers from inheriting font family
  ([c96047f](https://github.com/SoCreate/angular-playground/commit/c96047f)) 
* **style:** Remove link transitions
  ([046bad0](https://github.com/SoCreate/angular-playground/commit/046bad0)) 

<a name="2.0.2"></a>
# 2.0.2 (2017-09-28)

### Fixes
* **package peer dependencies:** Fix issue with peer dependencies for 5.0.0-beta.0 and higher
  ([cd16815](https://github.com/SoCreate/angular-playground/commit/cd16815)) 

<a name="2.0.1"></a>
# 2.0.1 (2017-09-28)

### Fixes
* **package peer dependencies:** Fix issue with peer dependencies not set to the right versions
  ([3c7d374](https://github.com/SoCreate/angular-playground/commit/3c7d374)) 

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
