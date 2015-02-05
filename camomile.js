var camomile = (function (fermata) {

    var my = {};
    var _api;

    var default_callback = function(err, data, headers) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        };
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // HELPER FUNCTIONS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var _user = function(id_user) {
        user = _api('user');
        if (id_user) {
            user = user(id_user);
        }
        return user;
    };

    var _group = function(id_group) {
        group = _api('group');
        if (id_group) {
            group = group(id_group);
        }
        return group;
    };

    var _corpus = function(id_corpus) {
        corpus = _api('corpus');
        if (id_corpus) {
            corpus = corpus(id_corpus);
        }
        return corpus;
    };

    var _media = function(id_media) {
        media = _api('media');
        if (id_media) {
            media = media(id_media);
        }
        return media;
    };

    var _layer = function(id_layer) {
        layer = _api('layer');
        if (id_layer) {
            layer = layer(id_layer);
        }
        return layer;
    };

    var _annotation = function(id_annotation) {
        annotation = _api('annotation');
        if (id_annotation) {
            annotation = annotation(id_annotation);
        }
        return annotation;
    };

    var _queue = function(id_queue) {
        queue = _api('queue');
        if (id_queue) {
            queue = queue(id_queue);
        }
        return queue;
    };

    var _id = function(result) {
        if (Array.isArray(result)) {
            return result.map(function(x) {return x._id;})
        } else {
            return result._id;
        };
    };

    var _ID = function(callback) {
        return function(err, data, headers) {
            if (!err) { data = _id(data); }
            callback(err, data, headers); 
        };
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AUTHENTICATION
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.login = function(username, password, url, callback) {
        callback = callback || default_callback;

        _api = fermata.json(url);
        
        data = {}; 
        data.username = username;
        data.password = password;

        _api('login').post(data, callback);
    };

    my.logout = function(callback) {
        callback = callback || default_callback;

        _api('logout').post({}, callback);
    };

    my.me = function(callback) {
        callback = callback || default_callback;

        _api('me').get(callback);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USERS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getUser = function(user, callback) {
        callback = callback || default_callback;

        _user(user).get(callback);
    };


    my.getUsers = function(username, callback) {
        callback = callback || default_callback;

        params = {}
        if (username !== undefined) {
            params.username = username;
        }

        _user()(params).get(callback);
    };

    my.createUser = function(username, password, description, role, callback) {
        callback = callback || default_callback;

        data = {};
        data.username = username;
        data.password = password;
        data.description = description || {};
        data.role = role || 'user';

        // if (returns_id) { callback = _ID(callback); }

        _user().post(data, callback);

    };

    my.updateUser = function(user, fields, callback) {
        callback = callback || default_callback;

        data = fields;
        _user(user).put(data, callback);
    };

    my.deleteUser = function(user, callback) {
        callback = callback || default_callback;

        _user(user).delete(callback);
    };

    my.getUserGroups = function(user, callback) {
        callback = callback || default_callback;

        _user(user)('group').get(callback);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // GROUPS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getGroup = function(group, callback) {
        callback = callback || default_callback;
        
        _group(group).get(callback);
    };

    my.getGroups = function(name, callback) {
        callback = callback || default_callback;
        
        params = {}
        if (name !== undefined) {
            params.name = name;
        }

        _group()(params).get(callback);
    };

    my.createGroup = function(name, description, callback) {
        callback = callback || default_callback;

        data = {};
        data.name = name;
        data.description = description || {};

        // if (returns_id) { callback = _ID(callback); }

        _group().post(data, callback);

    };

    my.updateGroup = function(group, fields, callback) {
        callback = callback || default_callback;

        data = fields;
        _group(group).put(data, callback);
    };

    my.deleteGroup = function(group, callback) {
        callback = callback || default_callback;

        _group(group).delete(callback);
    };

    my.addUserToGroup = function(user, group, callback) {
        callback = callback || default_callback;

        _group(group)('user')(user).put(callback);
    };

    my.removeUserFromGroup = function(user, group, callback) {
        callback = callback || default_callback;

        _group(group)('user')(user).delete(callback);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // CORPORA
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    // Get corpus by ID
    my.getCorpus = function(corpus, history, callback) {
        callback = callback || default_callback;

        params = {}
        params.history = history || 'off';

        _corpus(corpus)(params).get(callback);
    }

    // Get list of corpora
    my.getCorpora = function(name, history, callback) {
        callback = callback || default_callback;

        params = {}
        params.history = history || 'off';
        if (name) { params.name = name; }

        _corpus()(params).get(callback);
    }

    my.createCorpus = function(name, description, callback) {
        callback = callback || default_callback;

        data = {};
        data.name = name;
        data.description = description || {};

        _corpus().post(data, callback);
    };

    my.updateCorpus = function(corpus, fields, callback) {
        callback = callback || default_callback;

        data = fields;
        _corpus(corpus).put(data, callback);
    };

    my.deleteCorpus = function(corpus, callback) {
        callback = callback || default_callback;

        _corpus(corpus).delete(callback);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // MEDIA
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Get medium by ID
    my.getMedium = function(medium, callback) {
        callback = callback || default_callback;
        params = {}
        
        _media(medium)(params).get(callback);
    };

    // Get list of media
    my.getMedia = function(corpus, name, callback) {
        callback = callback || default_callback;

        params = {}
        if (name) { params.name = name; }; 
        
        if (corpus) {
            _corpus(corpus)('media')(params).get(callback);
        } else {
            _media()(params).get(callback);
        };       

    };

    my.createMedium = function(callback) {
        callback = callback || default_callback;

    };

    my.createMedia = function(callback) {
        callback = callback || default_callback;

    };

    my.updateMedium = function(callback) {
        callback = callback || default_callback;

    };

    my.deleteMedium = function(callback) {
        callback = callback || default_callback;

    };

    my.streamMedium = function(callback) {
        callback = callback || default_callback;

    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LAYERS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getLayer = function(callback) {
        callback = callback || default_callback;

    };

    my.getLayers = function(callback) {
        callback = callback || default_callback;

    };

    my.createLayer = function(callback) {
        callback = callback || default_callback;

    };

    my.updateLayer = function(callback) {
        callback = callback || default_callback;

    };

    my.deleteLayer = function(callback) {
        callback = callback || default_callback;

    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ANNOTATIONS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getAnnotation = function(callback) {
        callback = callback || default_callback;

    };

    my.getAnnotations = function(callback) {
        callback = callback || default_callback;

    };

    my.createAnnotation = function(callback) {
        callback = callback || default_callback;

    };

    my.createAnnotations = function(callback) {
        callback = callback || default_callback;

    };

    my.updateAnnotation = function(callback) {
        callback = callback || default_callback;

    };

    my.deleteAnnotation = function(callback) {
        callback = callback || default_callback;

    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // RIGHTS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getCorpusRights = function(callback) {
        callback = callback || default_callback;

    };

    my.setCorpusRights = function(callback) {
        callback = callback || default_callback;

    };

    my.removeCorpusRights = function(callback) {
        callback = callback || default_callback;

    };

    my.getLayerRights = function(callback) {
        callback = callback || default_callback;

    };

    my.setLayerRights = function(callback) {
        callback = callback || default_callback;

    };

    my.removeLayerRights = function(callback) {
        callback = callback || default_callback;

    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // QUEUES
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getQueues = function(callback) {
        callback = callback || default_callback;

    };

    my.createQueue = function(callback) {
        callback = callback || default_callback;

    };

    my.updateQueue = function(callback) {
        callback = callback || default_callback;

    };

    my.enqueue = function(callback) {
        callback = callback || default_callback;

    };

    my.dequeue = function(callback) {
        callback = callback || default_callback;

    };

    my.deleteQueue = function(callback) {
        callback = callback || default_callback;

    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILS
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    my.getDate = function(callback) {
        callback = callback || default_callback;

        _api('date').get(callback);
    };


    return my;

}(fermata));
