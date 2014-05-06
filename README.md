VF-Boilerplate
=========

This repository is a basic framework for developing a custom Visualforce app. It creates a nice directory structure, installs common boilerplate and dependencies, and sets you up with a build/deployment process, based on Grunt, that will allow you to get up and running right away and iterate rapidly.

##Requirements
- Node.js.
- A Salesforce org & account with the ability to upload an apex package.

#Getting Started
_Note: For readability, in this README, I assume you are working with a project called 'MyApp'. So anywhere you see 'MyApp', substitute the name you choose for your project._
####Setup
1. Clone this repository into a new folder called MyApp.

```git clone git@github.com:gpascale/vf-boilerplate.git MyApp```

2. Run the setup script to initialize the project directory. It takes one argument - the name of your project.

``` ./setup.sh MyApp```

3. The setup script also cuts ties with git, so your project directory will no longer be associated with this repository. If you want to store your project on git, now would be a good time to ```git init``` and create a new repository in this folder.

As you may have noticed, there is an apex page and some minimal code included by default - a hello world, if you will - so let's go ahead and build and deploy it.

####Build & Deployment
1. Before deploying, you need to run the build process. It's as easy as 
```
grunt build
```

2. Add an entry to the "profiles" object in Gruntfile.js containing the credentials of a user/org where you want to upload your app. 

```
var profiles = {
    example: {
        user: 'YOUR EMAIL',
        pass: 'YOUR PASSWORD',
        serverurl: 'YOUR ORG DOMAIN - e.g. https://test.salesforce.com'
    },
};
```

3. Deploy your app.
```
grunt deploy --profile=<name of profile you just added>
```

That's it. If deployment succeeds, you can view the app at http://test.salesforce.com/apex/MyApp.

#Editing
To start editing your app, it's helpful to understand what the build system is doing. In short, the build takes everything in the src/ and resources/ folders and combines it into an Apex package that

Apex stuff (pages, components, documents etc...) is uploaded as is. Javascript, LESS (css), templates and resources are combined into a zip file (MyApp.zip) which is uploaded as a static resource.

Before inclusion in the static resource:
- Javascript files (src/js/*) are concatenated to a file called MyApp.js
- Templates are compiled using JST and added to MyApp.js
- LESS is compiled and concatenated to a file called MyApp.css
- External JS dependencies (resources/js/* e.g. jQuery) are concatenated to a file called MyApp.external.js

This means that your apex pages can include all the CSS and JS in your project with just 3 include statements
```
    <apex:includeScript value="{!URLFOR($Resource.foobar, '/js/MyApp.external.js')}" />
    <apex:includeScript value="{!URLFOR($Resource.foobar, '/js/MyApp.js')}" />
    <apex:stylesheet value="{!URLFOR($Resource.foobar, '/css/MyApp.css')}" />
```

#Tips

##StageLocal
We can use the fact that JS and CSS are encapsulated in a single static resource to drastically speed up deployment times. Actually, we can speed it up by not deploying at all in many situations. StageLocal is a chrome extension included with VF-boilerplate that redirects requests for JS and CSS to your local machine. If you are developing using Chrome, this means that you don't have to do a deployment in order to see changes made to JS or CSS. You only have to deploy when modifying Apex. If you're like me, 95% of your edits will be to JS and CSS, so turning a ~18 second deployment into a .5 second build is a big win!

####Installation
- In Chrome, navigate to chrome://extensions
- Select "Load unpacked extension"
- Navigate to your project directory and select the stage local folder.
- You'll see a new extension called StageLocal - MyApp

*While StageLocal is incredibly handy while developing, make sure to turn it off when you need to really test your app in production. Just uncheck the box on the chrome://extensions page.

##Grunt Watch
Another time-saving development tool is a feature of grunt called watch. watch runs in the background and automatically triggers a build when code is changed. By default, the included Gruntfile is configured to rebuild when js, css or template files are changed and to deploy when apex is changed. This works perfectly in combination with StageLocal - you almost never have to deploy manually.