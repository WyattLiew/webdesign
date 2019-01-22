
// Get a database reference to projects
var db = firebase.database();
var newProgressRef = db.ref("Projects Add On");
var progressAddonImages = db.ref("Project add on image"); 
var storage = firebase.storage();
var progressStorageRef = storage.ref("Projects Add On");
var UID;

// get data from project page //
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(6);

var myData = localStorage.getItem("objectToPass");

// check user log in status //
firebase.auth().onAuthStateChanged(function(user){
if (user) {
	//user is signed in
UID = firebase.auth().currentUser.uid;

fetchProgress(queryString);
}else{
	//
}
});

// progress add button
document.getElementById('progressInputForm').addEventListener('submit',saveProgress);

function saveProgress(e){
var UID = firebase.auth().currentUser.uid;
var progressStatus= document.getElementById('progressStatus').value;
var progressDate = document.getElementById('progressDateInput').value;
var progressNotes = document.getElementById('progressNotesInput').value;
var vEveryone = document.getElementById("progressEveryone").checked;
	var vUserOnly = document.getElementById("progressUserOnly").checked;
var progressId = newProgressRef.push().key;
var visibility = true;

if (vEveryone == true) {
	visibility = true;
}else{
	visibility = false;
}

// input file
var selectedFile = document.querySelector('#progressUploadImages').files[0];

// get file name && timestamp
var fullPath = document.getElementById("progressUploadImages").files[0].name;
var filename;
if (fullPath) {
    filename = fullPath + " (" + Date.now() + ")";
}

var progress = {
	visibility: visibility,
	date: progressDate,
	id: progressId,
	imgURL: "",
	notes: progressNotes,
	status: progressStatus
}

var progressAddOn = {
	id: "",
	imgURL: ""
}


e.preventDefault();

if (selectedFile != null && progressDate !="" && selectedFile.type.match('image')) {
	// Upload image to firebase storage //
	var uploadImage = progressStorageRef.child(myData).child(filename).put(selectedFile);
	
	uploadImage.on('state_changed', function(snapshot){

	}, function(error){
		let errorMessage = error.message;
		alert("Error!:" +errorMessage);
	}, function() {
		//Handle successful uploads on complete
		//For instance, get the download URL: https// firebasestorage.googleapis.com/...
		var downloadURL = uploadImage.snapshot.downloadURL;
		uploadImage.snapshot.ref.getDownloadURL().then(function(downloadURL) {

		progress.imgURL = downloadURL;

		// save data to firebase
		newProgressRef.child(queryString).child(progressId).set(progress,function(error) {
		if (error) {
			let errorMessage = error.message;
			alert("Error!:" +errorMessage);
		} else {
			// Reset field
			document.getElementById('progressInputForm').reset();
			// retrieve data
			fetchProgress(queryString);
			//alert("Save Successfully!");
			var progressAlert = document.getElementById("progress-green-alert1");
			progressAlert.classList.remove("hidden");
		}
	});
	});
	});

	// input file
	var selectedFiles = document.querySelector('#progressUploadImages').files;

	for (var i = 0; i < selectedFiles.length;i++) {
		var files = selectedFiles[i];
		// get file name && timestamp
		var fullPaths = document.getElementById("progressUploadImages").files[i].name;
		var filenames = "";
		if (fullPaths) {
		    filenames = fullPaths +" (" + Date.now() + ")";
		}
		// check file image type
		if (files.type.match('image')){
			var uploadImages = progressStorageRef.child(myData).child(filenames).put(selectedFiles[i]);


		uploadImages.on('state_changed', function(snapshot){

	}, function(error){
   		let errorMessage = error.message;
		alert("Error!:" +errorMessage);
	}, function() {
		//Handle successful uploads on complete
		//For instance, get the download URL: https// firebasestorage.googleapis.com/...
		var downloadURLs = uploadImages.snapshot.downloadURL;
		uploadImages.snapshot.ref.getDownloadURL().then(function(downloadURLs) {
		// add imgurl to progress json
		progressAddOn.imgURL = downloadURLs;

		var imageId = progressAddonImages.push().key;
		// add image id to progress json
		progressAddOn.id = imageId;

		// save Add on image data to firebase
		progressAddonImages.child(progressId).child(imageId).set(progressAddOn,function(error) {
		if (error) {
			let errorMessage = error.message;
			alert("Error!:" +errorMessage);
		} else {
			console.log("Save successful");
		}
	});
	});
	});
	}else{
			alert("Please check your image type");
		}
	}
}else{
	alert("Please check your image type");
} 
}

// Fetch progress
function fetchProgress(queryString){
	firebase.database().ref('/Projects Add On/' + queryString).once('value').then(function(snapshot){
    var progressObject = snapshot.val();
	var progressList = document.getElementById('progressList');
	progressList.innerHTML = '';
    var keys = Object.keys(progressObject);

    for (var i = 0; i < keys.length; i++){

      var currentObject = progressObject[keys[i]];
      var progressID = currentObject.id;
      var progressStatusEdit = progressID+currentObject.status;
      var progressVisibilityEdit = progressID + currentObject.visibility;
      var progressImageURLEdit = progressID + currentObject.imgURL; 
      var progressDateEdit = progressID+currentObject.date;
      var progressNotesEdit = progressID+currentObject.notes+"1";

    progressList.innerHTML +='<div class="col-md-6">' +
    							'<div class="well box-style-2" id="\''+progressID+'\'">'+
								'<h6>Progress ID: ' + currentObject.id + '</h6>' +
								'<img src="'+currentObject.imgURL+'"class="img-thumbnail contentImage"">' +
								'<h3>' + '<input id="\''+progressStatusEdit+'\'" value="'+currentObject.status+'" class="text-capitalize" readonly required>' + '</h3>'+
								//'<h5>' + "Description: " + '<input id="\''+projectDescEdit+'\'" value="'+currentObject.description+'"  readonly>' + '</h5>'+
								'<span class="glyphicon glyphicon-time col-md-6">' +" "+ '<input id="\''+progressDateEdit+'\'" type="Date" value="'+currentObject.date+'"  readonly required>' + '</span>' +
								'<br></br>' +
								'<span class="glyphicon glyphicon-eye-open col-md-6">' + " " +'<input id="\''+progressVisibilityEdit+'\'" type="text" value="'+currentObject.visibility+'" class="text-uppercase" readonly required>' + ' </span>'+
								'<br></br>' +
								'<span class="glyphicon glyphicon-comment col-md-6">' + " " +'<input id="\''+progressNotesEdit+'\'" value="'+currentObject.notes+'"  readonly>' + '</span>' +
								'<br></br>' +
								'<a href="#" onclick="enterProject(\''+progressID+'\')" class="btn btn-success">Show more</a>' + " " + 
								'<a href="#" onclick="saveEdit(\''+progressID+'\', \''+progressVisibilityEdit+'\',\''+progressStatusEdit+'\',\''+progressDateEdit+'\',\''+progressNotesEdit+'\')" class="btn btn-success">Save</a>' + " " + 
								'<a href="#" onclick="cancelEdit(\''+progressID+'\')" class="btn btn-danger">cancel</a>' + " " + 
								'<div class="btn-group action-btn">' +
								'<button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action<span class="caret"></span></button>' +
								'<ul class="dropdown-menu">' +
							    '<li><a href="#" onclick="editProject(\''+progressID+'\')">Edit</a></li>'+
							    '<li role="separator" class="divider"></li>'+
							    '<li><a href="#" onclick="deleteProject(\''+progressID+'\')" >Delete</a></li>' +
							  	'</ul>'+
							  	'</div>' +
							  	'</div>' +
								'</div>';
    }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error: " +errorMessage);
  });
}

