var submitBtn = document.getElementById("referenceSubmitBtn");
var submitProgress = document.getElementById("submitProgress");
var trackingForm = document.getElementById("tracking-form");
var defectsHeader = document.getElementById("defectsHeader");
var progressHeader = document.getElementById("progressHeader");
var ImageHr = document.getElementById("ImageLineBorder");
/* Show more images var */
var MoreImgElement = document.getElementById("detailsHolder");
var MoreImgCol;
var Moreimage;
var currentRow;


/*Login progress*/

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
    let currentUser = firebase.auth().currentUser.uid;
    retrieveData(currentUser);
		//document.getElementById("user_div").style.display = "block";
		//document.getElementById("login_div").style.display = "none";
		//document.location.href = "progress.html";
	}else{
		//
	}
});



function login() {

	var userEmail = document.getElementById("email_field").value;
	var userPass = document.getElementById("password_field").value;
	var loginButton = document.getElementById("login-button");
	var loginProgress = document.getElementById("loginProgress");

	if(userEmail!="" && userPass!=""){
		loginProgress.style.display="block"
		loginButton.style.display="none"
	
	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(){
    // Users UID
    let currentUser = firebase.auth().currentUser.uid;
    // check authority
    checkAdmin(currentUser);
	}).catch(function(error) {
  	// Handle Errors here.
  	var errorCode = error.code;
  	var errorMessage = error.message;

  	window.alert("Error : " + errorMessage);
    // ...
    	loginProgress.style.display="none"
		  loginButton.style.display="block"
	});
}else{
  alert("Please fill in the blank.")
}
}

/* Login out progress*/

function signOutBtn(){
	firebase.auth().signOut().then(function() {
  	// Sign-out successful.
  	document.location.href = "login.html";
	}).catch(function(error) {
  	// An error happened.
  	var errorCode = error.code;
  	var errorMessage = error.message;
  	window.alert("Error : " + errorMessage);
});
}

function checkAdmin(currentUser){
  firebase.database().ref('/Users/' + currentUser).once('value').then(function(snapshot){
    var usersObject = snapshot.val();
    
    var isAdmin = snapshot.child("isAdmin").val();
    if(isAdmin == true){
      document.location.href = "projectList.html";
    }else{
      document.location.href = "progress.html";
    }
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
  });
}

function retrieveData(currentUser){
  firebase.database().ref('/Users/' + currentUser).once('value').then(function(snapshot){
    var usersObject = snapshot.val();
    
    var userName = snapshot.child("name").val().toUpperCase();

    setTimeout(() =>  document.getElementById("title-name").textContent = "Hi, " + userName , 3000);
    
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
  });
}


/*
(function (global) { 

    if(typeof (global) === "undefined") {
        throw new Error("window is undefined");
    }

    var _hash = "!";
    var noBackPlease = function () {
        global.location.href += "#";
    };

    global.onhashchange = function () {
        if (global.location.hash !== _hash) {
            global.location.hash = _hash;
        }
    };

    global.onload = function () {            
        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        document.body.onkeydown = function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree..
            e.stopPropagation();
        };          
    }

})(window);

*/


/*
 Home page reference ID part 1 
*/

function refSubmitclick() {
  var referenceID = document.getElementById("referenceIdText").value;
  var progress = document.getElementById("progress").checked;
  var defects = document.getElementById("defects").checked;

  if (referenceID !="" && progress == true) {
    submitBtn.style.display="none";
    submitProgress.style.display="inline-block";
    ImageHr.style.display='block';
    queryProgressDatabase(referenceID);
  }else if (referenceID !="" && defects ==true) {
    submitBtn.style.display="none";
    submitProgress.style.display="inline-block";
    ImageHr.style.display='block';
    queryDefectsDatabase(referenceID);
  }else{
    alert("Please check your reference id");
     submitBtn.style.display="inline-block";
  }
}

/* Defect details   */
function queryDefectsDatabase(referenceID){
  firebase.database().ref('/Defect Add On/' + referenceID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    //var imgArray = [];
   
    trackingForm.style.display="none";
    var keys = Object.keys(defectObject);
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      var element = document.getElementById("contentHolder");
      var currentRow;
      if(i % 3 == 0){
          currentRow = document.createElement("div");
          currentRow.classList.add("row");
          element.append(currentRow);
      }
      
      var col = document.createElement("div");
      col.classList.add("col-lg-4");
      //var image = document.createElement("img");
      //image.src = currentObject.imgURL;
      //image.id  = currentObject.id;
      //image.classList.add("contentImage");
      
      var imageID = currentObject.id;
      element.innerHTML+= '<div class="col-lg-4">' +
                          '<img src="'+currentObject.imgURL+'"class="contentImage"">' +
                          '<p>' + 'Date: ' + currentObject.date + '</p>' +
                          '<p>' + 'Defect: ' + currentObject.defect + '</p>' +
                          '<p>' + 'Comment: ' + currentObject.comments + '</p>' +
                          '<a href="#" onclick="selectImages(\''+imageID+'\')" class="mdl-button mdl-js-button">See more</a>';
      
      //imgArray.push(currentObject.id);
      //console.log(imgArray);

    /*
      var date = document.createElement("p");
      var node = document.createTextNode("Date: " + currentObject.date);
      date.appendChild(node);
      date.classList.add("image-description");
      var defect = document.createElement("p");
      var node1 = document.createTextNode("Defect: " + currentObject.defect);
      defect.appendChild(node1);
      defect.classList.add("image-description");
      var comment = document.createElement("p");
      var node2 = document.createTextNode("Comment: " + currentObject.comments);
      comment.appendChild(node2);
      comment.classList.add("image-description");
      col.appendChild(image);
      col.appendChild(date);
      col.appendChild(defect);
      col.appendChild(comment);
      currentRow.append(col);
      */
      }
      /*
      for (var i =0; i < document.images.length; i++){
        document.images[i].id = imgArray[i];
        console.log(document.images[i].id);
      }
      */
      submitBtn.style.display="inline-block";
      defectsHeader.style.display="flex";
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : Please check your reference ID, it's case sensitive.");
     submitBtn.style.display="inline-block";
     submitProgress.style.display="none";
     ImageHr.style.display='none';
     trackingForm.style.display="block";
  });
}

/* Defect Image show more when clicked */
function selectImages(id){
  firebase.database().ref('/Defect add on image/' + id).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    var keys = Object.keys(defectObject);

    // Hide images function //
    removeElement();
    // Show images //
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      
      if(i % 3 == 0){
          MoreImgCurrentRow = document.createElement("div");
          MoreImgCurrentRow.classList.add("row");
          MoreImgElement.append(MoreImgCurrentRow);
      }
      
      MoreImgCol = document.createElement("div");
      MoreImgCol.classList.add("col-lg-4");
      Moreimage = document.createElement("img");
      Moreimage.src = currentObject.imgURL;
      Moreimage.id  = currentObject.id;
      Moreimage.classList.add("contentImage");

      MoreImgCol.appendChild(Moreimage);
      MoreImgCurrentRow.append(MoreImgCol);
    }
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

// Hide images //
function removeElement(){
    while(MoreImgElement.hasChildNodes()){
    MoreImgElement.removeChild(MoreImgElement.firstChild);
  }
}



// Progress Add on //
function queryProgressDatabase(referenceID){
  firebase.database().ref('/Projects Add On/' + referenceID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();

    trackingForm.style.display="none";
    var keys = Object.keys(defectObject);
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      var element = document.getElementById("contentHolder");
      var currentRow;
      if(i % 3 == 0){
          currentRow = document.createElement("div");
          currentRow.classList.add("row");
          element.append(currentRow);
      }
      
      var col = document.createElement("div");
      col.classList.add("col-lg-4");
      
      var imageID = currentObject.id;
      element.innerHTML+= '<div class="col-lg-4">' +
                          '<img src="'+currentObject.imgURL+'"class="contentImage"">' +
                          '<p>' + 'Date: ' + currentObject.date + '</p>' +
                          '<p>' + 'Status: ' + currentObject.status + '</p>' +
                          '<p>' + 'Comment: ' + currentObject.notes + '</p>' +
                          '<a href="#" onclick="selectProgressImages(\''+imageID+'\')" class="mdl-button mdl-js-button">See more</a>';
    
      submitBtn.style.display="inline-block";
      progressHeader.style.display="flex";
    }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : Please check your reference ID, it's case sensitive.");
    submitBtn.style.display="inline-block";
    submitProgress.style.display="none";
     ImageHr.style.display='none';
     trackingForm.style.display="block";
  });
}


/* Progress Image show more when clicked */
function selectProgressImages(id){
  firebase.database().ref('/Project add on image/' + id).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    var keys = Object.keys(defectObject);

    // Hide images function //
    removeElement();
    // Show images //
    for (var i = 0; i < keys.length; i++){
      var currentObject = defectObject[keys[i]];
      
      if(i % 3 == 0){
          MoreImgCurrentRow = document.createElement("div");
          MoreImgCurrentRow.classList.add("row");
          MoreImgElement.append(MoreImgCurrentRow);
      }
      
      MoreImgCol = document.createElement("div");
      MoreImgCol.classList.add("col-lg-4");
      Moreimage = document.createElement("img");
      Moreimage.src = currentObject.imgURL;
      Moreimage.id  = currentObject.id;
      Moreimage.classList.add("contentImage");

      MoreImgCol.appendChild(Moreimage);
      MoreImgCurrentRow.append(MoreImgCol);
    }
}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

