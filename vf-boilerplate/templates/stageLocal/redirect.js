chrome.webRequest.onBeforeRequest.addListener(function (details) {
    var redirectUrl = null;
    var files = [ 
        { path: 'intermediates/staticresources/js', name: '##PROJECT_NAME##.js' }, 
        { path: 'intermediates/staticresources/css', name: '##PROJECT_NAME##.css' }, 
    ];

    for (var i = 0; i < files.length; ++i) {
        if (details.url.indexOf(files[i].name) != -1) {
            redirectUrl = chrome.extension.getURL('files/build/' + files[i].path
                                                 + '/' + files[i].name);
            console.log(files[i].name + " redirecting locally");
            break;
        }
    }

    if (redirectUrl)
        return { redirectUrl: redirectUrl };
    else
        return { };
}, {
    urls: ["<all_urls>"] /* List of URL's */
}, ["blocking"]); // Block intercepted requests until this handler has finished