<a name="1.1.8"></a>
# 1.1.8  (2017-02-11)

### Fixes
* **build** Added `any[]` type to `sandboxes` variable to support environments using `noImplicitAny` for their TypeScript builds.


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
