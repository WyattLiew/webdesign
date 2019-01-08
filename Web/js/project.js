

// Get a database reference to projects
var db = firebase.database();
var newProjectRef = db.ref("Projects");
var newClientRef = db.ref("Clients");
var UID;

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    UID = firebase.auth().currentUser.uid;
    
    fetchProjects(UID);
	}else{
		//
	}
});



//document.getElementById('projectInputForm').addEventListener('submit',saveProject);

function saveProject(){
	var projTitle = document.getElementById('projectTitleInput').value;
	var projDesc = document.getElementById('projectDescInput').value;
	var projCliName = document.getElementById('projectCliNameInput').value;
	var projCliNum = document.getElementById('projectCliNumInput').value;
	var projCliEmail = document.getElementById('projectCliEmailInput').value;
	var projLocation = document.getElementById('projectLocationInput').value;
	var projDate = document.getElementById('projectDateInput').value;
	var projNotes = document.getElementById('projectNotesInput').value;
	var projectId = newProjectRef.push().key;
	var clientId = newClientRef.push().key;

	var project = {
		clientID: clientId,
		date: projDate,
		description: projDesc,
		email: projCliEmail,
		id: projectId,
		location: projLocation,
		name: projCliName,
		notes: projNotes,
		number: projCliNum,
		title: projTitle
	}

	var client = {
		email: projCliEmail,
		id: clientId,
		location: projLocation,
		name: projCliName,
		number: projCliNum
	}

	if (projTitle !="" && projCliName !="" && 
		projCliNum !="" && projCliEmail !="" &&
		projLocation !="" && projDate !="") {
		// save data to firebase
		newProjectRef.child(UID).child(projectId).set(project,function(error){
			if (error) {
				alert("Error!");
			}else {
				submitBtn.style.display="none";
    			submitProgress.style.display="inline-block";
				// Reset field
				document.getElementById('projectInputForm').reset();
				// retrieve data
				fetchProjects(UID);
			}
		});
	}else{
		//
	}
}

function fetchProjects(UID){
	firebase.database().ref('/Projects/' + UID).once('value').then(function(snapshot){
    var projectObject = snapshot.val();
	var projectList = document.getElementById('projectList');
	projectList.innerHTML = '';
    var keys = Object.keys(projectObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = projectObject[keys[i]];
      
    projectList.innerHTML +='<div class="well">'+
								'<h6>Project ID: ' + currentObject.id + '</h6>' +
								'<h3>' + currentObject.title + '</h3>'+
								'<h5>' + "Description: " +currentObject.description + '</h5>'+
								'<p><span class="glyphicon glyphicon-time"</span>' + " "+currentObject.date + '</p>' +
								'<p><span class="glyphicon glyphicon-user"</span>' + " " +currentObject.name + '</p>'+
								'<p><span class="glyphicon glyphicon-earphone"</span>' + " "+currentObject.number + '</p>'+
								'<p><span class="glyphicon glyphicon-envelope"</span>' + " "+ currentObject.email + '</p>'+
								'<p><span class="glyphicon glyphicon-flag"</span>' + " " +currentObject.location + '</p>'+
								'<p><span class="glyphicon glyphicon-info-sign"</span>' + " " + currentObject.notes + '</p>'+
								'<a href="#" onclick="setStatusClosed(\''+currentObject.id+'\')" class="btn btn-success">Enter</a>' + " " + 
								'<a href="#" onclick="deleteIssue(\''+currentObject.id+'\')" class="btn btn-danger">Delete</a>' +
								'</div>';
    }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}
	