VF-Boilerplate
=========

This repo contains common boilerplate for writing a Visualforce app using grunt as a build system.

##Requirements
Node.js
A Salesforce org/account with Visualforce upload privileges.

##Usage
1. Clone this repo, but give it the name you want your project to have
``` git clone git@github.com:gpascale/vf-boilerplate.git MyProject```
2. Run the setup script, passing it the name of your project.
``` ./setup.sh MyProject```
3. The setup script cuts ties with the vf-boilerplate repo and intitializes a new repository in your project directory. You can now push it to github.
``` git remote add origin git@github.com:gpascale/MyProject.git```
4. Add your Salesforce org credentials in Gruntfile.js
```var profiles = {
        example: {
            user: 'YOUR EMAIL',
            pass: 'YOUR PASSWORD',
            serverurl: 'YOUR ORG - e.g. https://test.salesforce.com'
        },
    };
```
5. You're now ready to build and deploy your code.
    - `grunt build` - Builds the application
    - `grunt deploy --profile=<your profile>` - Deploys the application to your Salesforce org
    - `grunt watch --profile=<your profile>` - Put grunt in watch mode. It will build whenever a file is changed and attempt to deploy if you change a file that necessitates it, such as an apex page. I recommend you use grunt watch almost all the time while developing.
6. Once deployed, access your app at http://<salesforce url>/apex/<project name>. <salesforce url> is the url you use to access your Salesforce org (e.g. login.salesforce.com)

##Project Layout
TODO

##StageLocal
If you develop in Chrome, you can take advantage of a time-saving tool called StageLocal. StageLocal is a Chrome extension that redirects many AJAX requests to your local  setup.sh creates a specific version for your project. 


### Enabling tab in Stage-left S1
1. Go to develop -> pages to your new page
2. Click edit, make sure the "Available for Salesforce mobile apps" is enabled
3. Edit the user profile to make sure your new tabs visibility is set to "Default On" and not "hidden"
4. Go to "Mobile Navigation", make sure your new tab is selected
