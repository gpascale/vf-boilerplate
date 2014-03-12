if [[ $# -eq 0 ]] ; then
    echo 'A name for your project is required'
    exit 1
fi

PROJECT_NAME=$1

#!/bin/sh
echo "Creating necessary folders..."
mkdir ./src
mkdir ./src/js
mkdir ./src/less
mkdir ./src/apex
mkdir ./src/apex/pages
mkdir ./src/apex/classes
mkdir ./src/apex/objects
mkdir ./src/apex/layouts
mkdir ./src/apex/triggers
mkdir ./src/apex/components
mkdir ./stageLocal
mkdir ./apexBuildTemplates
mkdir ./resources
mkdir ./resources/js

echo "Copying code, markup and CSS boilerplate..."
repl="s/##PROJECT_NAME##/${PROJECT_NAME}/g"
sed -e $repl ./templates/package.json > ./package.json
sed -e $repl ./templates/Gruntfile.js > ./Gruntfile.js
sed -e $repl ./templates/.gitignore > ./.gitignore
sed -e $repl ./templates/app.page > "./src/apex/pages/$1.page"
sed -e $repl ./templates/stageLocal/manifest.json > ./stageLocal/manifest.json
sed -e $repl ./templates/stageLocal/redirect.js > ./stageLocal/redirect.js
sed -e $repl ./templates/forcetkclient.component > ./src/apex/components/forcetkclient.component
cp ./templates/HelloWorld.js ./src/js/
cp ./templates/HelloWorld.less ./src/less/
cp ./templates/apexBuildTemplates/* ./apexBuildTemplates/
cp ./templates/extJs/*.js ./resources/js/
# TODO copy over the models

echo "Setting up dependencies from NPM..."
npm install

echo "Removing stuff you don't want..."
rm -rf .git
rm -rf templates
echo "Welcome to $1. This is an empty README" > README.md
rm setup.sh

echo "Initializing new git project..."
git init
git add .
git commit -m "Initial Commit"