<a name="1.3.1"></a>
# 1.3.1 (2017-03-01)

### Fixes
* **cli:** Add source files to build for distribution to fix issue with Angular CLI first build throwing error  
  ([#14](https://github.com/SoCreate/angular-playground/issues/14))  
  ([1cd125d](https://github.com/SoCreate/angular-playground/commit/1cd125d)
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
