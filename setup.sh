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
mkdir ./stageLocal

echo "Copying code, markup and CSS boilerplate..."
repl="s/##PROJECT_NAME##/${PROJECT_NAME}/g"
sed -e $repl ./templates/package.json > ./package.json
sed -e $repl ./templates/Gruntfile.js > ./Gruntfile.js
sed -e $repl ./templates/.gitignore > ./.gitignore
sed -e $repl ./templates/app.page > ./src/apex/pages/app.page
sed -e $repl ./templates/stageLocal/manifest.json > ./stageLocal/manifest.json
sed -e $repl ./templates/stageLocal/redirect.js > ./stageLocal/redirect.js
# TODO copy over the models

echo "Setting up dependencies from NPM..."
npm install

echo "Removing stuff you don't want..."
rm -rf .git
rm -rf templates
rm README.md
rm setup.sh

echo "Initializing new git project..."
git init
git add .
git commit -m "Initial Commit"