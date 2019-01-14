

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
      
    projectList.innerHTML +='<div class="well" id="projDetails">'+
								'<h6>Project ID: ' + currentObject.id + '</h6>' +
								'<h3>' + '<input value="'+currentObject.title+'" readonly>' + '</h3>'+
								'<h5>' + "Description: " + '<input value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input value="'+currentObject.date+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-user col-md-6 ">'+ " " +'<input value="'+currentObject.name+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-earphone col-md-6">' + " " +'<input value="'+currentObject.number+'" readonly>' + ' </span>'+
								'<br></br>' +
								'<span class="glyphicon glyphicon-envelope col-md-6">' + " " +'<input value="'+currentObject.email+'"  readonly>' + "</span>" +
								'<br></br>' +
								'<span class="glyphicon glyphicon-flag col-md-6">' + " " +'<input value="'+currentObject.location+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-info-sign col-md-6">' + " " +'<input value="'+currentObject.notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="setStatusClosed(\''+currentObject.id+'\')" class="btn btn-success">Enter</a>' + " " + 
								'<a href="#" onclick="saveProject(\''+currentObject.id+'\')" class="btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit()" class="btn btn-danger">cancel</a>' + " " + 
								'<div class="btn-group">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editProject(\''+currentObject.id+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProject(\''+currentObject.id+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
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

function editProject(projId) {
	var form = document.getElementById('projDetails');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=false;
	}
	form.classList.add("invert");
}

function cancelEdit() {
	var form = document.getElementById('projDetails');
	var ipt = form.getElementsByTagName('input');
	var l=ipt.length;
	while (l--) {
		ipt[l].readOnly=true;
	}
	form.classList.remove("invert");
}

function saveProject(projId) {
	var UID = firebase.auth().currentUser.uid;
	var projTitle = document.getElementById('projectTitleInput').value;
	var projDesc = document.getElementById('projectDescInput').value;
	var projCliName = document.getElementById('projectCliNameInput').value;
	var projCliNum = document.getElementById('projectCliNumInput').value;
	var projCliEmail = document.getElementById('projectCliEmailInput').value;
	var projLocation = document.getElementById('projectLocationInput').value;
	var projDate = document.getElementById('projectDateInput').value;
	var projNotes = document.getElementById('projectNotesInput').value;

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

	// save data to firebase
		newProjectRef.child(UID).child(projId).set(project,function(error) {
			if (error) {
				alert("Error!");
			} else {
				cancelEdit();
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
