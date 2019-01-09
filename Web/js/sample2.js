
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


document.getElementById('formBtn').addEventListener('click',showForm);
var Textinput = document.getElementById('projForm');

function showForm(e){
	if (Textinput.style.display === "none") {
	Textinput.style.display="block";
	}else{
		Textinput.style.display="none";
	}
}

document.getElementById('projectInputForm').addEventListener('submit',saveProject);
projSubmitProgress = document.getElementById("submitProgress");
projAddBtn = document.getElementById("add-btn");

function saveProject(e){
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

	e.preventDefault();

	if (projTitle !="" && projCliName !="" && 
		projCliNum !="" && projCliEmail !="" &&
		projLocation !="" && projDate !="") {
		// Show progress
		projSubmitProgress.style.display="inline-block";
		projAddBtn.style.display="none";

		// save data to firebase
		newProjectRef.child(UID).child(projectId).set(project,function(error) {
			if (error) {
				alert("Error!");
			} else {
				// Reset field
				document.getElementById('projectInputForm').reset();
				// retrieve data
				fetchProjects(UID);
				//alert("Save Successfully!");
				var projAlert = document.getElementById("proj-green-alert1");
				projAlert.classList.remove("hidden");
				projSubmitProgress.style.display="none";
				projAddBtn.style.display="inline-block";
			}
		});
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
								'<form>' +
								'<h3>' + currentObject.title + '</h3>'+
								'<h5>' + "Description: " + '<input value="'+currentObject.description+'" style="border:none;outline:none;background:none;" readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input value="'+currentObject.date+'" style="border:none;outline:none;background:none;" readonly>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-user col-md-6 ">'+ " " +'<input value="'+currentObject.name+'" style="border:none;outline:none;background:none;" readonly>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-earphone col-md-6">' + " " +'<input value="'+currentObject.number+'" style="border:none;outline:none;background:none;" readonly>' + ' </span>'+
								'<br></br>' +
								'<span class="glyphicon glyphicon-envelope col-md-6">' + " " +'<input value="'+currentObject.email+'" style="border:none;outline:none;background:none" readonly>' + "</span>" +
								'<br></br>' +
								'<span class="glyphicon glyphicon-flag col-md-6">' + " " +'<input value="'+currentObject.location+'" style="border:none;outline:none;background:none;" readonly>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-info-sign col-md-6">' + " " +'<input value="'+currentObject.notes+'" style="border:none;outline:none;background:none;" readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="setStatusClosed(\''+currentObject.id+'\')" class="btn btn-success">Enter</a>' + " " + 
								'<div class="btn-group">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="deleteIssue(\''+currentObject.id+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProject(\''+currentObject.id+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</form> '+
								'</div>';
    }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

function deleteProject(projId) {
	var UID = firebase.auth().currentUser.uid;
	var result = confirm("Are you sure to delete this item?\nYou will not be able to recover this information!");
	if (result) {
    //Logic to delete the item
    newProjectRef.child(UID).child(projId).remove()
  		.then(function() {
    	//alert("Remove succeeded.");
    	var projAlert = document.getElementById("proj-green-alert2");
		projAlert.classList.remove("hidden");
    	fetchProjects(UID);
  	})
  		.catch(function(error) {
    	console.log("Remove failed: " + error.message);
  	});
	}

}
