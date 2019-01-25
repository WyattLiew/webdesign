
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
    checkMember(currentUser);
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
  	document.location.href = "index.html";
	}).catch(function(error) {
  	// An error happened.
  	var errorCode = error.code;
  	var errorMessage = error.message;
  	window.alert("Error : " + errorMessage);
});
}

function checkMember(currentUser){
  firebase.database().ref('/Users/' + currentUser).once('value').then(function(snapshot){
    var usersObject = snapshot.val();
    
    var isMember = snapshot.child("isMember").val();
    if(isMember == true){
      document.location.href = "home.html";
    }else{
      document.location.href = "clients.html";
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


// prevent return button
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


