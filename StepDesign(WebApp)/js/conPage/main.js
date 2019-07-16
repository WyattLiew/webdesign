navToggle = document.getElementById("nav-toggle").addEventListener('click', hideNavBar);

mainNav = document.getElementById("main-nav");

function hideNavBar () {
	if(mainNav.classList){
		mainNav.classList.toggle('navOpen');
	}else{
		 // For IE9
		  var classes = mainNav.className.split(" ");
		  var i = classes.indexOf("navOpen");

		  if (i >= 1) 
		    classes.splice(i, 1);
		  else 
		    classes.push("navOpen");
		    mainNav.className = classes.join(" "); 
		}
	}


