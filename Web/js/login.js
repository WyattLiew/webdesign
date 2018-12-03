/*Login progress*/

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//user is signed in
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
		document.location.href = "progress.html";
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

// reference ID part 1

function refSubmitclick() {
  var referenceID = document.getElementById("referenceIdText").value;
  if (referenceID !="") {
    queryDatabase(referenceID);
  }else{
    alert("Please enter your reference id");
  }
}

function queryDatabase(referenceID){
  firebase.database().ref('/Defect Add On/' + referenceID).once('value').then(function(snapshot){
    var defectObject = snapshot.val();
    console.log(defectObject);
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
      var image = document.createElement("img");
      image.src = currentObject.imgURL;
      image.classList.add("contentImage");
      var date = document.createElement("p");
      var node = document.createTextNode("Date: " + currentObject.date);
      date.appendChild(node);
      var defect = document.createElement("p");
      var node1 = document.createTextNode("Defect: " + currentObject.defect);
      defect.appendChild(node1);
      var comment = document.createElement("p");
      var node2 = document.createTextNode("Comment: " + currentObject.comments);
      comment.appendChild(node2);
      col.append(image);
      col.append(date);
      col.append(defect);
      col.append(comment);
      currentRow.append(col);
      image.onclick = function(){ console.log(currentObject.id)}
      }
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : Please check your reference ID, it's case sensitive.");
  });
}