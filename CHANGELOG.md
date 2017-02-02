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
