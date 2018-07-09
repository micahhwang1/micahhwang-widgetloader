/* 
   Micah Hwang - Adobe Widget-Loader Demo
   The below is a consolidation of all code used to create my app, Widget-Loader.
   demo fronted at "http://micahhwang.info" will need Sign credentials to access functionality (limited to Customer Accts only)
*/

/*
   homePage Function
*/
//OAuth into Adobe Sign
function loadWidgets() {
	window.open("https://secure.na1.echosign.com/public/oauth?redirect_uri=https://micahhwang.info/widget-loader&response_type=code&client_id=CBJCHBCAABAAmDsoapDgeLlU1xHgqtruO_e96FvPZZyM&scope=user_login:self+widget_read:self",
				"_self");
}

/*
   widgetLoader Functions
*/
//declarations 
var webCode = getUrlParameter('web_access_point');
var code = ("code=" + getUrlParameter('code'));
var client_id = "client_id=CBJCHBCAABAAmDsoapDgeLlU1xHgqtruO_e96FvPZZyM";
var client_secret = "client_secret=PxatjYuYYrdfDYG0gmNfkdR9ccRf_tj0";
var grant_type = "grant_type=authorization_code";
var redirect_uri = "redirect_uri=https://micahhwang.info";
var postString = (code + "&" + client_id + "&" + client_secret + "&" + redirect_uri + "&" + grant_type);
var accessToken, refreshToken, expiresIn, tokenType, widgetUrl, companyWidgetUser;

//retrieve url accessToken, refreshToken, expireTime, and run inner-function pullWidgetList()
window.onload = getURL;

//on companyWidgetEmail input field, watch for 'enter key' press and then run function refreshCompanyWidgetList
document.getElementById('compEmail').onkeydown = function(event) {
	if(event.keyCode == 13) {
		var compEmail = document.getElementById('compEmail').value;
		refreshCompanyWidgetList(compEmail);
	}
}

//runs on window load, to preload userWidgetList
function getURL() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", apiCode , true);

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {
 	   if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
   	   	var data = xhr.responseText;
   	   	var jsonResponse = JSON.parse(data);
   	   	accessToken = jsonResponse["access_token"];
   	   	refreshToken = jsonResponse["refresh_token"];
   	   	expiresIn = jsonResponse["expires_in"];
   	   	tokenType = jsonResponse["token_type"];
   	   	pullWidgetList(tokenType, accessToken);
	   }
	}

	xhr.send(postString);
}

//run on load to update variables with correct parameters, apiCode, webCode, and code
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

//refresh button on page that runs a function pullWidgetList upon request to refresh widget list if needed
function refreshWidgetList(){
	pullWidgetList(tokenType, accessToken)
}

//refresh button on page that runs a function pullCompanyWidgetList upon request to refresh widget list if needed
function refreshCompanyWidgetList(compEmail){
	pullCompanyWidgetList(tokenType, accessToken, compEmail)
}

//runs a GET request to pull userWidgetList, parses JSONresponse, takes returned data and places into correct elements to create panels for each user widget
function pullWidgetList(tokenType, accessToken) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",  ("https://api.na1.echosign.com:443/api/rest/v6/widgets"), true);

	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader('Authorization', tokenType + " " + accessToken);

	xhr.onreadystatechange = function() {
 	   if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
		var data = xhr.responseText;
   		var jsonResponse = JSON.parse(data);
   		var addPanels = document.createDocumentFragment();
   		for(var i=0; i<jsonResponse.userWidgetList.length; i++) {
   			var userWidgetList = jsonResponse.userWidgetList[i];
   			//alert(userWidgetList.url);
   			var newDiv = document.createElement('div');
   			var newDivA = document.createElement('a');
   			var newDivPanel = document.createElement('div');
   			var newDivPanelBody = document.createElement('div');
   			var newDivh2 = document.createElement('h2');
   			var newDivi = document.createElement('i');
   			var newDivp = document.createElement('p');
   			var newDivh2text = document.createTextNode(userWidgetList.name);
   			var newDivptext = document.createTextNode("Click to eSign");
   			newDiv.className = 'hvr-float';
   			newDivA.href = userWidgetList.url;
   			newDivA.target = '_blank';
   			newDivPanel.className = 'panel';
   			newDivPanelBody.className = 'panel-body';
   			newDivi.className ='fas fa-file-contract';
   			addPanels.appendChild(newDiv);
   			newDiv.appendChild(newDivA);
   			newDivA.appendChild(newDivPanel);
   			newDivPanel.appendChild(newDivPanelBody);
   			newDivh2.appendChild(newDivh2text);
   			newDivp.appendChild(newDivptext);
   			newDivPanelBody.appendChild(newDivh2);
   			newDivPanelBody.appendChild(newDivi);
   			newDivPanelBody.appendChild(newDivp);

   		}
   		document.getElementById('userWidgetContainer').innerHTML ="";
   		document.getElementById('userWidgetContainer').appendChild(addPanels);
	   } else {
	   	  document.getElementById('userWidgetContainer').innerHTML ="No Widgets Found!";
	   }
	}

	xhr.send();
}

//runs a GET request to pull companyWidgetList, parses JSONresponse, takes returned data and places into correct elements to create panels for each user widget
function pullCompanyWidgetList(tokenType, accessToken, compEmail) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",  ("https://api.na1.echosign.com:443/api/rest/v6/widgets"), true);

	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader('Authorization', tokenType + " " + accessToken);
	xhr.setRequestHeader('X-On-Behalf-Of-User', "email:" + compEmail);

	xhr.onreadystatechange = function() {
 	   if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
		var data = xhr.responseText;
   		var jsonResponse = JSON.parse(data);
   		var addPanels = document.createDocumentFragment();
   		for(var i=0; i<jsonResponse.userWidgetList.length; i++) {
   			var userWidgetList = jsonResponse.userWidgetList[i];
   			//alert(userWidgetList.url);
   			var newDiv = document.createElement('div');
   			var newDivA = document.createElement('a');
   			var newDivPanel = document.createElement('div');
   			var newDivPanelBody = document.createElement('div');
   			var newDivh2 = document.createElement('h2');
   			var newDivi = document.createElement('i');
   			var newDivp = document.createElement('p');
   			var newDivh2text = document.createTextNode(userWidgetList.name);
   			var newDivptext = document.createTextNode("Click to eSign");
   			newDiv.className = 'hvr-float';
   			newDivA.href = userWidgetList.url;
   			newDivA.target = '_blank';
   			newDivPanel.className = 'panel';
   			newDivPanelBody.className = 'panel-body';
   			newDivi.className ='fas fa-file-contract';
   			addPanels.appendChild(newDiv);
   			newDiv.appendChild(newDivA);
   			newDivA.appendChild(newDivPanel);
   			newDivPanel.appendChild(newDivPanelBody);
   			newDivh2.appendChild(newDivh2text);
   			newDivp.appendChild(newDivptext);
   			newDivPanelBody.appendChild(newDivh2);
   			newDivPanelBody.appendChild(newDivi);
   			newDivPanelBody.appendChild(newDivp);

   		}
   		document.getElementById('userCompanyWidgetContainer').innerHTML ="";
   		document.getElementById('userCompanyWidgetContainer').appendChild(addPanels);
	   } else {
	   	  document.getElementById('userCompanyWidgetContainer').innerHTML ="No Widgets Found!";
	   }
	}

	xhr.send();
}