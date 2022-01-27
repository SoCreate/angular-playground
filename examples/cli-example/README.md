# Playground Angular CLI Example

## Development:

Install dependencies:
```
npm i
```
Build angular-playground package and link it globally
```
npm run clean
npm run build
npm link
```

Install dependencies in example project
```
cd examples/cli-example/
npm i
npm link angular-playground
```

Run the example App
```
npm run playground
```
#

To make changes to angular playground source code and see the change you must stop the playground
from running and rebuild the angular-playground then run the example app again.
#

Rebuild Playground
```
cd ../..
npm run rebuild
```

Run the example App
```
npm run playground
```
