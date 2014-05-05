$(document).ready(function() {
    // Do an example SOQL query to get some properties of the logged-in user
    var forcetkClient = getForceTkClient();
    var query = "SELECT Name, FullPhotoUrl FROM User Where Id = '" + window.userId + "'";
    forcetkClient.query(query,function(result, status) {
        if (status == 'success' && result.records) {
            // Render the hello template using information about the current user. Templates are compiled
            // into javascript functions and attached to ##PROJECT_NAME##.Templates as part of the build process.
            console.log("Successfully ran SOQL query to get user. Name is " + result.records[0].Name);
            var tmpl = ##PROJECT_NAME##.Templates.hello({ name: result.records[0].Name,
                                                photoUrl: result.records[0].FullPhotoUrl });
            $('#container').append(tmpl);
        }
        else {
            console.log("Failed to run SOQL query");
        }
    });
});