// c 2013 

console.log("I am logging like crazy");
function load_help_window() {
  var w = window.open("chrome-extension://fkelfaihobjpfilfiifbhjchdmcjialm/help-for-page.html",
	      "",
	      "status=no, height=800, width=650, resizable=no, toolbar=no, menubar=no, scrollbars=no, location=no, directories=no"
	      );
  // w.onload=function() { $("#helptitle", w.document).text("this will be something else"); };
  console.log("there is an open window");
  $(document).ready( function() { console.log("this is the doc ready handler speaking"); console.log("current helptitle: " + $("body", w.document.body)) ;  $("#helptitle").text("this will be something else"); });
}

$("#dataTable tbody tr").on("click", function(event){
  alert($(this).text());
  });

  
var buttontext=document.createTextNode("Help for " +  $("div[class=page_heading]").text() + "...");
buttontext.id="helptext";
var helpbutton=document.createElement("BUTTON");
helpbutton.appendChild(buttontext);
helpbutton.addEventListener("click", load_help_window, false);
$("#SAMBanner").after(helpbutton);;
