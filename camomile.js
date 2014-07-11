/* 
 * Gestion des requetes au serveur
 */

camomile = function(){
	var adresse = "";
	
	/**
	 * Description
	 * @method camomile
	 * @return 
	 */
	function camomile(){
	}
	
	/**
	 * Login 
	 * @method login
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String username
	 * @param String password
	 * @param String adr
	 * @return 
	 */
	camomile.login = function(callbackFunction, username, password, adr) {
		// log
		adresse = adr;
		var data = {};
		data.username = username;
		data.password = password;
		camomile.post("/login", data, callbackFunction);
	}
    
    
	/**
	 * Logout 
	 * @method logout
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.logout = function(callbackFunction) {
		camomile.post("/logout", null, callbackFunction);
	}
    
    
	/**
	 * Popup error 
	 * @method error
	 * @param int status
	 * @param String errorThrown
	 * @param String textStatus
	 * @return 
	 */
	camomile.error = function(status, errorThrown, textStatus){
		console.log(status, errorThrown, textStatus);
		alert(textStatus + " " + status +" : " + errorThrown);
		// Pourrait etre etoffe 
	}
    
	/**
	 * Get 
	 * @method get
	 * @param String route
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.get = function(route, callbackFunction){
		$j.ajax(
			{
                url: adresse + route,
                type: 'GET',
                success: function(data) {
					callbackFunction(data);
                },
                crossDomain: true,
                //dataType: 'json', // Format of the answer
                xhrFields: {
					withCredentials: true
                },
                error: function(jqXHR, textStatus, errorThrown) {
					camomile.error(jqXHR.status, errorThrown, textStatus);
                }
            }
        );
	}
    
    
	/**
	 * Delete 
	 * @method del
	 * @param String route
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.del = function(route, callbackFunction){
		$j.ajax(
			{
                url:  adresse + route,
                type: 'DELETE',
                success: function(data) {
					callbackFunction(data);
                },
                crossDomain: true,
                //dataType: 'json',  // Format of the answer
                xhrFields: {
					withCredentials: true
                },
                error: function(jqXHR, textStatus, errorThrown) {
					camomile.error(jqXHR.status, errorThrown, textStatus);
                }
            }
        );
	}
    
	/**
	 * Post 
	 * @method post
	 * @param String route
	 * @param JSON data
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.post = function(route, data, callbackFunction){
		if (data != null){ // For request as login
			$j.ajax(
				{
                    url:  adresse + route,
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function(data) {
						callbackFunction(data);
                    },
                    crossDomain: true,
                    //dataType: 'json',  // Format of the answer
                    xhrFields: {
						withCredentials: true
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
				    	camomile.error(jqXHR.status, errorThrown, textStatus);
                    }
                }
            );
		} else { // For request as logout
			$j.ajax(
				{
                    url:  adresse + route,
                    type: 'POST',
                    success: function(data) {
						callbackFunction(data);
                    },
                    crossDomain: true,
                    //dataType: 'json',  // Format of the answer
                    xhrFields: {
						withCredentials: true
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
						camomile.error(jqXHR.status, errorThrown, textStatus);
                    }
                }
            );
		}
	}
    
    
	/**
	 * Put 
	 * @method put
	 * @param String route
	 * @param JSON data
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.put = function(route, data, callbackFunction){
		$j.ajax(
			{
                url:  adresse + route,
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(data) {
					callbackFunction(data);
                },
                crossDomain: true,
                //dataType: 'json',  // Format of the answer
                xhrFields: {
					withCredentials: true
                },
                error: function(jqXHR, textStatus, errorThrown) {
					camomile.error(jqXHR.status, errorThrown, textStatus);
                }
            }
        );
	}
    
	/**
	 * Create User 
	 * @method create_user
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String name
	 * @param String password
	 * @param String affiliation
	 * @return 
	 */
	camomile.create_user = function(callbackFunction, name, password, affiliation){
		var data = {};
		data.username = name;
		data.password = password;
		data.affiliation = affiliation;
		camomile.post("/user", data, callbackFunction);
	}
    
	/**
	 * See All User 
	 * @method all_user
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.all_user = function(callbackFunction){
		camomile.get("/user", callbackFunction);
	}
    
    
	/**
	 * Get ACL for an element 
	 * @method get_ACL
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String idAnnotation
	 * @return 
	 */
	camomile.get_ACL = function(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation){
		camomile.get((route(idCorpus, idMedia, idLayer, idAnnotation) + "/acl"), callbackFunction);
	}
    
	/**
	 * Set ACL for an element 
	 * @method set_ACL
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String un
	 * @param String ur
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String idAnnotation
	 * @return 
	 */
	camomile.set_ACL = function(callbackFunction, username, userright, idCorpus, idMedia, idLayer, idAnnotation){
		var data = {};
		data.username = username;
		data.userright = userright;
		camomile.put((route(idCorpus, idMedia, idLayer, idAnnotation) + "/acl"), data, callbackFunction);
	}
    
    
	/**
	 * Route builder 
	 * @method route
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String idAnnotation
	 * @return url
	 */
	camomile.route = function(idCorpus, idMedia, idLayer, idAnnotation){
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
    
	/**
	 * Corpus builder 
	 * @method corpus
	 * @param String name
	 * @return data
	 */
	camomile.corpus = function(name){
		var data = {};
		data.name = name;
		return data;
	}
	/**
	 * Get all corpus 
	 * @method getCorpus
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @return 
	 */
	camomile.getCorpus = function(callbackFunction){
		camomile.get("/corpus", callbackFunction);
	}
    
	/**
	 * Get corpus by name 
	 * @method corpusById
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @return 
	 */
	camomile.corpusById = function(callbackFunction, idCorpus){
		camomile.get(camomile.route(idCorpus), callbackFunction);
	}
    
	/**
	 * New corpus 
	 * @method create_corpus
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String name
	 * @return 
	 */
	camomile.create_corpus = function(callbackFunction, name){
		camomile.post("/corpus", camomile.corpus(name), callbackFunction);
	}
    
	/**
	 * Set Corpus 
	 * @method set_corpus
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String name
	 * @return 
	 */
	camomile.set_corpus = function(callbackfunction, idCorpus, name){
		camomile.put(camomile.route(idCorpus), camomile.corpus(name), callbackfunction);
	}
    
	/**
	 * Remove Corpus
	 * @method remove_corpus
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @return 
	 */
	camomile.remove_corpus = function(callbackFunction, idCorpus){
		camomile.del(camomile.route(idCorpus), callbackFunction);
        
	}
    
	/***********/
	/** MEDIA **/
	/***********/
    
	/**
	 * Media builder 
	 * @method media
	 * @param String name
	 * @param String url
	 * @return data
	 */
	camomile.media = function(name, url){
		var data = {};
		data.name = name;
		data. url = url;
		return data;
	}
    
	/**
	 * Get all media 
	 * @method getMedias
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @return 
	 */
	camomile.getMedias = function(callbackFunction, idCorpus){
		camomile.get(camomile.route(idCorpus) + "/media", callbackFunction);
	}
    
	/**
	 * Get media by name 
	 * @method mediaById
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @return 
	 */
	camomile.mediaById = function(callbackFunction, idCorpus, idMedia ){
		camomile.get(camomile.route(idCorpus, idMedia) , callbackFunction);
	}
    
	/**
	 * New Media 
	 * @method create_media
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String name
	 * @param String url
	 * @return 
	 */
	camomile.create_media = function(callbackFunction, idCorpus, name, url){
		camomile.post(camomile.route(idCorpus) + "/media", camomile.media(name, url), callbackFunction);
	}
    
	/**
	 * Set Media 
	 * @method set_media
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String name
	 * @param String url
	 * @return 
	 */
	camomile.set_media = function(callbackFunction, idCorpus, idMedia, name, url){
		camomile.put(camomile.route(idCorpus, idMedia), camomille.media(name, url), callbackFunction);
	}
    
	/**
	 * Remove Media
	 * @method remove_media
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @return 
	 */
	camomile.remove_media = function(callbackFunction, idCorpus, idMedia){
		camomile.del(camomile.route(idCorpus, idMedia), callbackFunction);
        
	}
    
	/***********/
	/** LAYER **/
	/***********/
    
	/**
	 * Layer builder 
	 * @method layer
	 * @param String layertype
	 * @param String fragmenttype
	 * @param String datatype
	 * @param String source
	 * @return data
	 */
	camomile.layer = function(layertype, fragmenttype, datatype, source){
		var data = {};
		data.layer_type = layertype;
		data.fragment_type = fragmenttype;
		data.data_type = datatype;
		data.source = source;
		return data;
	}
	/**
	 * Get all layer 
	 * @method getLayers
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @return 
	 */
	camomile.getLayers = function(callbackFunction, idCorpus, idMedia){
		camomile.get(camomile.route(idCorpus, idMedia) + "/layer", callbackFunction);
	}
    
	/**
	 * Get Layer by name 
	 * @method layerById
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @return 
	 */
	camomile.layerById = function(callbackFunction, idCorpus, idMedia, idLayer){
		camomile.get(camomile.route(idCorpus, idMedia, idLayer), callbackFunction);
	}
    
	/**
	 * New Layer 
	 * @method create_layer
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String layertyp
	 * @param String fragmenttyp
	 * @param String datatyp
	 * @param String source
	 * @return 
	 */
	camomile.create_layer = function(callbackFunction, idCorpus, idMedia, layertyp, fragmenttyp, datatyp, source){
		camomile.post(camomile.route(idCorpus, idMedia) + "/layer", camomile.layer(layertyp, fragmenttyp, datatyp, source), callbackFunction);
	}
    
	/**
	 * Set Layer 
	 * @method set_layer
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String layertyp
	 * @param String fragtyp
	 * @param String datatyp
	 * @param String source
	 * @return 
	 */
	camomile.set_layer = function(callbackFunction, idCorpus, idMedia, idLayer, layertyp, fragtyp, datatyp, source){
		camomile.put(camomile.route(idCorpus, idMedia, idLayer), camomile.layer(layertyp, fragtyp, datatyp, source), callbackFunction);
	}
    
	/**
	 * Remove Layer
	 * @method remove_layer
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String callbackFunction
	 * @return 
	 */
	camomile.remove_layer = function(callbackFunction, idCorpus, idMedia, idLayer, callbackFunction){
		camomile.del(camomile.route(idCorpus, idMedia, idLayer), callbackFunction);
        
	}
    
	/****************/
	/** ANNOTATION **/
	/****************/
    
	/**
	 * Annotation builder 
	 * @method annotation
	 * @param String fragmenttyp
	 * @param String datatyp
	 * @return data
	 */
	camomile.annotation = function(frag, dat){
		var data = {};
		data.fragment = frag;
		data.data = dat;
		return data;
	}
    
	/**
	 * Get all Annotation 
	 * @method getAnnotations
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @return 
	 */
	camomile.getAnnotations = function(callbackFunction, idCorpus, idMedia, idLayer){
		camomile.get(camomile.route(idCorpus, idMedia, idLayer) + "/annotation", callbackFunction);
	}
    
	/**
	 * Get Annotation by name 
	 * @method annotationById
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String idAnnotation
	 * @return 
	 */
	camomile.annotationById = function(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation){
		camomile.get(camomile.route(idCorpus, idMedia, idLayer, idAnnotation), callbackFunction);
	}
    
	/**
	 * New Annotation 
	 * @method create_annotation
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String frag
	 * @param String dat // Forme : "[1, 2, 3, …]"
	 * @return 
	 */
	camomile.create_annotation = function(callbackFunction, idCorpus, idMedia, idLayer, frag, dat){
		camomile.post(camomile.route(idCorpus, idMedia, idLayer) + "/annotation", camomile.annotation(frag, dat), callbackFunction);
	}
    
	/**
	 * Set Annotation
	 * @method set_annotation
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String idAnnotation
	 * @param String frag
	 * @param String dat
	 * @return 
	 */
	camomile.set_annotation = function(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation, frag, dat){
		camomile.put(camomile.route(idCorpus, idMedia, idLayer, idAnnotation), camomile.annotation(frag, dat), callbackFunction);
	}
    
	/**
	 * Remove Annotation
	 * @method remove_annotation
	 * @param function callbackFunction(data) ou data sous format JSON
	 * @param String idCorpus
	 * @param String idMedia
	 * @param String idLayer
	 * @param String idAnnotation
	 * @return 
	 */
	camomile.remove_annotation = function(callbackFunction, idCorpus, idMedia, idLayer, idAnnotation){
		camomile.del(camomile.route(idCorpus, idMedia, idLayer, idAnnotation), callbackFunction);
	}
	return camomile;
}();