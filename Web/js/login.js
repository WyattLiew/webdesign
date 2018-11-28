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