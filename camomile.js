

// http://lit-shore-5364.herokuapp.com

var adresse = ""

/* Login */
function login(callback, username, password, adr) {
	// log
	adresse= adr
	var data = {};
	data.username = username;
	data.password = password;
	post("/login", data, callback);
}


/* Logout */
function logout(callback) {
	post("/logout", null, callback);
}


/* Popup error */ 
function error(status, errorThrown, textStatus){
	alert(textStatus + " " + status +" : " + errorThrown);	
}

/* Get */
function get(route, callback){
	$j.ajax({
		url: adresse + route,
		type: 'GET',
		success: function(data) {
			callback(data);
		},
		crossDomain: true,
		//dataType: 'json', // Format of the answer
		xhrFields: {
			withCredentials: true
		},
		error: function(jqXHR, textStatus, errorThrown) {
			error(jqXHR.status, errorThrown, textStatus);
		}
	});
}


/* Delete */
function del(route, callback){
	$j.ajax({
		url:  adresse + route,
		type: 'DELETE',
		success: function(data) {
			callback(data);
		},
		crossDomain: true,
		//dataType: 'json',  // Format of the answer
		xhrFields: {
			withCredentials: true
		},
		error: function(jqXHR, textStatus, errorThrown) {
			error(jqXHR.status);
		}
	});	
}

/* Post */
function post(route, data, callback){
	if (data != null){ // For request as login
		$j.ajax({
			url:  adresse + route,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(data) {
				callback(data);
			},
			crossDomain: true,
			//dataType: 'json',  // Format of the answer
			xhrFields: {
				withCredentials: true
			},
			error: function(jqXHR, textStatus, errorThrown) {
			    error(jqXHR.status, errorThrown, textStatus);
			}
		});
	} else { // For request as logout
		$j.ajax({
			url:  adresse + route,
			type: 'POST',
			success: function(data) {
				callback(data);
			},
			crossDomain: true,
			//dataType: 'json',  // Format of the answer
			xhrFields: {
				withCredentials: true
			},
			error: function(jqXHR, textStatus, errorThrown) {
				error(jqXHR.status, errorThrown, textStatus);
			}
		});
	}
}


/* Put */
function put(route, data, callback){
	$j.ajax({
		url:  adresse + route,
		type: 'PUT',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(data) {
			callback(data);
		},
		crossDomain: true,
		//dataType: 'json',  // Format of the answer
		xhrFields: {
			withCredentials: true
		},
		error: function(jqXHR, textStatus, errorThrown) {
			error(jqXHR.status);
		}
	});
}




/* Create User */
function create_user(callback, name, password, affiliation){
	var data = {};
	data.username = name;
	data.password = password;
	data.affiliation = affiliation;
	post("/user", data, callback);
}

/* See All User */
function all_user(callback){
	get("/user", callback);
}


/* Get ACL for an element */
function get_ACL(callback, idCorpus, idMedia, idLayer, idAnnotation){
	get((route(idCorpus, idMedia, idLayer, idAnnotation) + "/acl"), callback);
}

/* Set ACL for an element */
function set_ACL(callback, un, ur, idCorpus, idMedia, idLayer, idAnnotation){
	var data = {};
	data.username = un;
	data.userright = ur;
	put((route(idCorpus, idMedia, idLayer, idAnnotation) + "/acl"), data, callback);
}


/* Route builder */
function route(idCorpus, idMedia, idLayer, idAnnotation){
	var url = ""; 
	if(idCorpus != null){
		url += "/corpus/" + idCorpus;
		if(idMedia != null){
			url += "/media/" + idMedia;
			if(idLayer != null){
				url += "/layer/" + idLayer;
				if(idAnnotation != null){
					url += "/annotation/" + idAnnotation;
				}
			}
		}
	}
	return url; 
}

/************/
/** CORPUS **/
/************/

/* Corpus builder */
function corpus(name){
	var data = {};
	data.name = name;
	return data;
}
/* Get all corpus */
function getCorpus(callbackFunction){
	get("/corpus", callbackFunction);
}

/* Get corpus by name */
function corpusById(callbackFunction, idCorpus){
	get(route(idCorpus), callbackFunction);
}

/* New corpus */
function create_corpus(callbackFunction, name){
	post("/corpus", corpus(name), callbackFunction);
}

/* Set Corpus */
function set_corpus(callbackfunction, idCorpus, name){
	put(route(idCorpus), corpus(name), callbackfunction);
}

/* Remove Corpus*/ 
function remove_corpus(callbackFunction, idCorpus){
	del(route(idCorpus), callbackFunction);

}

/***********/
/** MEDIA **/
/***********/

/* Media builder */
function media(name, url){
	var data = {};
	data.name = name; 
	data. url = url;
	return data;
}

/* Get all media */
function getMedias(callbackFunction, idCorpus){
	get(route(idCorpus) + "/media", callbackFunction);
}

/* Get media by name */
function mediaById(callbackFunction, idCorpus, idMedia ){
	get(route(idCorpus, idMedia) , callbackFunction);
}

/* New Media */
function create_media(callbackFunction, idCorpus, name, url){ 
	post(route(idCorpus) + "/media", media(name, url), callbackFunction);
}

/* Set Media */
function set_media(callbackFunction, idCorpus, idMedia, name, url){
	put(route(idCorpus, idMedia), media(name, url), callbackFunction);
}

/* Remove Media*/ 
function remove_media(callbackFunction, idCorpus, idMedia){
	del(route(idCorpus, idMedia), callbackFunction);

}

/***********/
/** LAYER **/
/***********/

/* Layer builder */
function layer(layertype, fragmenttype, datatype, source){
	var data = {}
	data.layer_type = layertype; 
	data.fragment_type = fragmenttype;
	data.data_type = datatype;
	data.source = source;
	return data;
}
/* Get all layer */
function getLayers(callbackFunction, idCorpus, idMedia){
	get(route(idCorpus, idMedia) + "/layer", callbackFunction);
}

/* Get Layer by name */
function layerById(callbackFunction, idCorpus, idMedia, idLayer){
	get(route(idCorpus, idMedia, idLayer), callbackFunction);
}

/* New Layer */
function create_layer(callbackFunction, idCorpus, idMedia, layertyp, fragmenttyp, datatyp, source){
	post(route(idCorpus, idMedia) + "/layer", layer(layertyp, fragmenttyp, datatyp, source), callbackFunction);
}

/* Set Layer */
function set_layer(callbackFunction, idCorpus, idMedia, idLayer, layertyp, fragtyp, datatyp, source){
	put(route(idCorpus, idMedia, idLayer), layer(layertyp, fragtyp, datatyp, source), callbackFunction);
}

/* Remove Layer*/ 
function remove_layer(callbackFunction, idCorpus, idMedia, idLayer, callbackFunction){
	del(route(idCorpus, idMedia, idLayer), callbackFunction);

}

/****************/
/** ANNOTATION **/
/****************/

/* Annotation builder */
function annotation(fragmenttyp, datatyp){
	var data = {};
	data.fragment_typ = fragmenttyp;
	data.datatyp = datatyp;
	return data;
}

/* Get all Annotation */
function getAnnotations(callbackFunction, idCorpus, idMedia, idLayer){
	get(route(idCorpus, idMedia, idLayer) + "/annotation", callbackFunction);
}

/* Get Annotation by name */
function annotationById(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation){
	get(route(idCorpus, idMedia, idLayer, idAnnotation), callbackFunction);
}

/* New Annotation */
function create_annotation(callbackFunction, idCorpus, idMedia, idLayer, frag, dat){
	post(route(idCorpus, idMedia, idLayer) + "/annotation", annotation(frag, dat), callbackFunction);
}

/* Set Annotation*/
function set_annotation(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation, frag, dat){
	put(route(idCorpus, idMedia, idLayer, idAnnotation), annotation(frag, dat), callbackFunction);
}

/* Remove Annotation*/ 
function remove_annotation(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation){
	del(route(idCorpus, idMedia, idLayer, idAnnotation), callbackFunction);
}

