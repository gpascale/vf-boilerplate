usage()
{
cat << EOF

Usage: $0 [PROJECTNAME]

Run this script with a project name (required) to initialize your new project.

EOF
}

PROJECT_NAME=$1
if [[ -z $PROJECT_NAME ]]
then
     usage
     exit 1
fi

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
mkdir ./src/apex/documents
mkdir ./src/apex/documents/"$1"
mkdir ./src/apex/tabs
mkdir ./src/templates
mkdir ./stageLocal
mkdir ./apexBuildTemplates
mkdir ./resources
mkdir ./resources/js
mkdir ./resources/images

echo "Copying code, markup and CSS boilerplate..."
repl="s/##PROJECT_NAME##/${PROJECT_NAME}/g"
sed -e $repl ./templates/package.json > ./package.json
sed -e $repl ./templates/Gruntfile.js > ./Gruntfile.js
sed -e $repl ./templates/.gitignore > ./.gitignore
sed -e $repl ./templates/app.page > "./src/apex/pages/$1.page"
sed -e $repl ./templates/app.tab > "./src/apex/tabs/$1.tab"
sed -e $repl ./templates/stageLocal/manifest.json > ./stageLocal/manifest.json
sed -e $repl ./templates/stageLocal/redirect.js > ./stageLocal/redirect.js
sed -e $repl ./templates/forcetkclient.component > ./src/apex/components/forcetkclient.component
sed -e $repl ./templates/HelloWorld.js > "./src/js/$1.js"
sed -e $repl ./templates/hello.tmpl > "./src/templates/hello.tmpl"
cp ./templates/HelloWorld.less "./src/less/$1.less"
cp ./templates/apexBuildTemplates/* ./apexBuildTemplates/
cp ./templates/extJs/*.js ./resources/js/
cp ./templates/*.png ./resource/images/
cp ./templates/app_icon.png "./src/apex/documents/$1"
# TODO copy over the models

echo "Setting up dependencies from NPM..."
npm install

echo "Removing git stuff (disassociating this folder from vf-boilerplate repo)."
rm -rf .git
rm -rf templates
rm setup.sh
rm README.md
