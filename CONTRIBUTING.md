# Contributing to Angular Playground

 - [Issues and Bugs](#issue)
 - [Request/Add a Feature](#feature)
 - [Working on the Source Code](#dev)
 
## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
[submitting an issue][submitissue] to our [GitHub Repository][github]. Even better, 
you can [submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Want a Feature?
You can *request* a new feature by [submitting an issue][submitissue] to our [GitHub
Repository][github]. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

### <a name="submit-pr"></a> Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

* Search [GitHub](https://github.com/socreate/angular-playground/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.
* Fork the repo and make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch.
* Commit your changes using a descriptive commit message.
* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `angular-playground:master`.
* If we suggest changes then:
  * Make the required updates.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

## <a name="dev"></a> Working on the Playground source code
### Initial setup
Install dependencies for angular-playground:

```
npm i
```

Then install dependencies for the example-app:
```
cd ./examples/cli-example/
npm i
```
### Running the example app
From `./examples/cli-example`:
```
npm run playground:build && npm run playground
```

From this point you can work on the Playground and make changes to the source code.  You will need to stop the Playground
from running and build the app again (run `npm run restage` from the source code root after your changes).  Then run `npm run playground`
in the example app root folder again to see the changes you made to the source code in action.

```
Ctrl-C (stop playground)
cd ../../
npm run restage
cd examples/cli-example/
npm run playground
```

### Tooling
To run bash scripts on Windows, add the [Git for Windows](https://git-scm.com/) `/bin/`
folder (defaults to `C:\Program Files\Git\bin`) to your path, or install a terminal emulator like
[Cygwin](https://cygwin.com/).


[github]: https://github.com/socreate/angular-playground
[submitissue]: https://github.com/socreate/angular-playground/issues/new
