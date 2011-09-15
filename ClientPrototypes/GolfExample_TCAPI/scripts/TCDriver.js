var tc_lrs = TCDriver_GetLRSObject();
//alert(JSON.stringify(tc_lrs));

function TCDriver_GetLRSObject(){
	var lrsProps = ["endpoint","auth","actor","registration","activity_id"];
	var lrs = new Object();
	
	for (var prop in lrsProps){
		if (getQueryStringParam(lrsProps[prop]) != ""){
			lrs[lrsProps[prop]] = getQueryStringParam(lrsProps[prop]);
		}
	}
	return lrs;
}


function TCDriver_CheckStatus(xhr){
	if(xhr.status!=204){
		alert("There was a problem sending data back to the Learning Record Store.");
    }
}

function TCDriver_SendStatement (lrs,stmt) {
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", lrs.endpoint+_ruuid(), true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Authorization", lrs.auth);
		xhr.onreadystatechange = function() {
		    if(xhr.readyState == 4 ) {
	             TCDriver_CheckStatus(xhr);
			}
		};
		xhr.send(JSON.stringify(stmt));
	}
}


/***************************
 Tin Can Statement  
****************************/
function TCStatement(lrsObj){
	this.lrs = lrsObj;
	this.actor = eval("(" + lrsObj.actor + ")");
	this.verb = null;
	this.object = null;
	return this;
}
TCStatement.prototype.SetValue = function(name,value){
	this[name] = value;
	return this;
};
TCStatement.prototype.GetStatement = function(){
	var stmt = new Object();
	for (var name in this)
	{
		if (name != "lrs"){
			stmt[name] = this[name];
		} 
		
	}
	return stmt;
};
TCStatement.prototype.Send = function() {
	TCDriver_SendStatement(this.lrs,this.GetStatement());
}



/***************************
 Tin Can Generic Object (for chaining, basically)
****************************/
function TCObject(){
	return this;
}
TCObject.prototype.SetValue = function(name,value){
	this[name] = value;
	return this;
};



/* Other Util functions  */
function getQueryStringParam( name )
{
	
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1]);
}

/*!
Excerpt from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
function _ruuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
        });
 }

	
	
