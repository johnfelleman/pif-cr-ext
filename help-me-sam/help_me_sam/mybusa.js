var element=document.getElementById("SAMBanner");
if (!element) {
  alert("no SAMBanner");
}

// https://www.sam.gov/portal/public/SAM/confused.png
// var logo=document.createElement('img');
// logo.src="https://dl.dropboxusercontent.com/u/31869061/confused.png";

var buttontext=document.createTextNode("Get PIF Help...");
buttontext.id="helptext";
var helpbutton=document.createElement("BUTTON");
// helpbutton.style.background="black";
helpbutton.appendChild(buttontext);
var url="http://modus-operandi.herokuapp.com/";
helpbutton.addEventListener("click", function(){ window.open(url, "Window2", "status=no,height=400,width=500,resizable=yes,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no"); }, false);

element.appendChild(helpbutton);
