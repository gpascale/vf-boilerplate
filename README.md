Basic boilerplate for a VisualForce project using a grunt build system

###Installation

1. Copy the contents of this project into a new folder
2. run ./setup.sh project_name   e.g. "./setup.sh myNewProject"
3. Once the script has completed, modify Gruntfile.js, search for "example" and modify the user login and password
4. run "grunt watch --profile=example" this will deploy to salesforce
5. go to the url http://<salesforce_url e.g test.salesforce.com>/apex/myNewProject (or whatever name you used), you should see a hellow world page

### Enabling tab in Stage-left S1
1. Go to develop -> pages to your new page
2. Click edit, make sure the "Available for Salesforce mobile apps" is enabled
3. Edit the user profile to make sure your new tabs visibility is set to "Default On" and not "hidden"
4. Go to "Mobile Navigation", make sure your new tab is selected