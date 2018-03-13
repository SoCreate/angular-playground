# Contributing to Playground for Angular

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
* Make your changes in a new git branch:

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
cd ./packages/angular-playground/
npm i
```

Then install dependencies for the example-app:
```
cd ../..
cd ./examples/cli-example/
npm i
```
### Running the example app
From `./examples/cli-example`:
```
npm run playground:build && npm run playground
```

From this point you can work on the Playground `app` and `api` code,
but you will need to stop the playground from running and re-run it (which will
handle re-installing the latest changes for the package).
If you need to work on the `cli.ts` code you will need to 
run `npm run build` from the project root after your changes.


[github]: https://github.com/socreate/angular-playground
[submitissue]: https://github.com/socreate/angular-playground/issues/new
