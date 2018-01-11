npm run build --prefix ./packages/angular-playground

declare -a examples=( 'cli-example' 'example-app-embed-mode' 'example-app-webpack' )
for ex in "${examples[@]}"
do
    rm -rf "./examples/$ex/node_modules/angular-playground/"
    mkdir "./examples/$ex/node_modules/angular-playground/"
    cp -r ./packages/angular-playground/dist/ "./examples/$ex/node_modules/angular-playground/dist/"
    cp ./packages/angular-playground/package.json "./examples/$ex/node_modules/angular-playground/"
done
echo 'finished copying examples'

