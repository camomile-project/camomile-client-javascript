// The MIT License (MIT)

// Copyright (c) 2014-2015 CNRS

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";
var fermata = require("fermata");

fermata.registerPlugin('cookieAuth', function (transport, camomileClient) {
  return function (req, callback) {
    if (camomileClient._cookies) req.headers['Cookie'] = camomileClient._cookies;
    else req.options.xhr = {withCredentials: true};
    transport(req, callback);
  }
});

fermata.registerPlugin('jsonAuth', function (transport, baseURL, camomileClient) {
  return transport.using('json', baseURL).using('cookieAuth', camomileClient);
});

var default_callback = function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
};


function _id(result) {
  if (Array.isArray(result)) {
    return result.map(function (x) {
      return x._id;
    });
  }
  return result._id;
}

function _ID(callback) {
  return function (err, data, headers) {
    if (!err) {
      data = _id(data);
    }
    callback(err, data, headers);
  };
}


class Camomile {
  constructor(url) {
    this._baseUrl = url;
    this._api = fermata.jsonAuth(url, this);
    this._cookies = undefined;
    this._evSource = undefined;
  }


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// HELPER FUNCTIONS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  _user(id_user) {
    var user = this._api('user');
    if (id_user) {
      user = user(id_user);
    }
    return user;
  };

  _group(id_group) {
    var group = this._api('group');
    if (id_group) {
      group = group(id_group);
    }
    return group;
  };

  _corpus(id_corpus) {
    var corpus = this._api('corpus');
    if (id_corpus) {
      corpus = corpus(id_corpus);
    }
    return corpus;
  };

  _medium(id_medium) {
    var medium = this._api('medium');
    if (id_medium) {
      medium = medium(id_medium);
    }
    return medium;
  };

  _layer(id_layer) {
    var layer = this._api('layer');
    if (id_layer) {
      layer = layer(id_layer);
    }
    return layer;
  };

  _annotation(id_annotation) {
    var annotation = this._api('annotation');
    if (id_annotation) {
      annotation = annotation(id_annotation);
    }
    return annotation;
  };

  _queue(id_queue) {
    var queue = this._api('queue');
    if (id_queue) {
      queue = queue(id_queue);
    }
    return queue;
  };


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// AUTHENTICATION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setURL(url) {
    this._baseUrl = url;

    fermata.registerPlugin('cookieAuth', function (transport) {
      return function (req, callback) {
        if (this._cookies) req.headers['Cookie'] = this._cookies;
        else req.options.xhr = {withCredentials: true};
        transport(req, callback);
      }
    });

    fermata.registerPlugin('jsonAuth', function (transport, baseURL) {
      return transport.using('json', baseURL).using('cookieAuth');
    });

    this._api = fermata.jsonAuth(url);
  };

  login(username, password, callback = default_callback) {
    var data = {};
    data.username = username;
    data.password = password;

    this._api('login').post(data, (err, result, data) => {
      if (err) {
        return callback(err);
      }
      if (data['Set-Cookie'] && data['Set-Cookie'][0]) this._cookies = data['Set-Cookie'][0];

      callback(err, result, data);
    });
  };

  logout(callback = default_callback) {
    this._api('logout').post({}, callback);
  };

  me(callback = default_callback) {
    this._api('me').get(callback);
  };

  getMyGroups(callback = default_callback) {
    this._api('me')('group').get(callback);
  };

  update_password(new_password, callback = default_callback) {
    var data = {};
    data.password = new_password;

    this._api('me').put(data, callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// USERS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getUser(user, callback = default_callback) {

    this._user(user).get(callback);
  };

  getUsers(callback = default_callback, {returns_id,filter={}} = {}) {
    // Available filters: username, role

    if (returns_id) {
      callback = _ID(callback);
    }

    this._user()(filter).get(callback);
  };

  createUser(username, password, description = {}, role = 'user', callback = default_callback, {returns_id} = {}) {

    if (returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.username = username;
    data.password = password;
    data.description = description;
    data.role = role;

    this._user().post(data, callback);
  };

  updateUser(user, fields = {}, callback = default_callback) {
    // Updatable fields: password, description, role

    this._user(user).put(fields, callback);
  };

  deleteUser(user, callback = default_callback) {
    this._user(user).delete(callback);
  };

  getUserGroups(user, callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    this._user(user)('group').get(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GROUPS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getGroup(group, callback = default_callback) {
    this._group(group).get(callback);
  };

  getGroups(callback = default_callback, {returns_id,filter={}} = {}) {
    // Available filters: name

    if (returns_id) {
      callback = _ID(callback);
    }


    this._group()(filter).get(callback);
  };

  createGroup(name, description = {}, callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description;

    this._group().post(data, callback);
  };

  updateGroup(group, fields = {}, callback = default_callback) {
    // Updatable fields: description

    this._group(group).put(fields, callback);
  }

  deleteGroup(group, callback = default_callback) {
    this. _group(group).delete(callback);
  }

  addUserToGroup(user, group, callback = default_callback) {
    this._group(group)('user')(user).put(callback);
  }

  removeUserFromGroup(user, group, callback = default_callback) {
    this._group(group)('user')(user).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CORPORA
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get corpus by ID
  getCorpus(corpus, callback = default_callback, {history} = {}) {
    var filter = {};
    if (history) {
      filter.history = history;
    }

    this._corpus(corpus)(filter).get(callback);
  };

// Get list of corpora
  getCorpora(callback = default_callback, {returns_id,filter={},history}={}) {
    // Available filters: name

    if (returns_id) {
      callback = _ID(callback);
    }

    if (history) {
      filter.history = history;
    }

    this._corpus()(filter).get(callback);
  };

  createCorpus(name, description = {}, callback = default_callback, {returns_id}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description;

    this._corpus().post(data, callback);
  };

  updateCorpus(corpus, fields = {}, callback = default_callback) {
    // Updatable fields: name?, description

    this._corpus(corpus).put(fields, callback);
  };

  deleteCorpus(corpus, callback = default_callback) {

    this._corpus(corpus).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// MEDIA
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get medium by ID
  getMedium(medium, callback = default_callback, {history} = {}) {
    var filter = {};
    if (history) {
      filter.history = history;
    }

    this._medium(medium)(filter).get(callback);
  };

// Get medium URL, e.g. for use in <video> src attribute
  getMediumURL(medium, format = "video") {
    return this._medium(medium)(format)();
  };

// Get list of media
  getMedia(callback = default_callback, {filter= {},returns_count,returns_id,history}={}) {
    // Available filters: id_corpus, name

    // route /corpus/:id_corpus/medium/count
    if (returns_count) {

      if (filter.id_corpus === undefined) {
        callback('returns_count needs options.filter.id_corpus to be set', null);
        return;
      }

      let id_corpus = filter.id_corpus;
      delete filter.id_corpus;

      this._corpus(id_corpus)('medium')('count')(filter).get(callback);

      return;
    }

    if (returns_id) {
      callback = _ID(callback);
    }

    if (history) {
      filter.history = history;
    }

    if (filter.id_corpus !== undefined) {
      let id_corpus = filter.id_corpus;
      delete filter.id_corpus;
      this._corpus(id_corpus)('medium')(filter).get(callback);
    } else {
      this._medium()(filter).get(callback);
    }

  };

  createMedium(corpus, name, url, description = {}, callback = default_callback, {returns_id} = {}) {

    if (returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.url = url;
    data.description = description;

    this._corpus(corpus)('medium').post(data, callback);

  };

  createMedia(corpus, media, callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    this._corpus(corpus)('medium').post(media, callback);
  };

  updateMedium(medium, fields = {}, callback = default_callback) {
    // Updatable fields: name?, url, description

    this._medium(medium).put(fields, callback);
  };

  deleteMedium(medium, callback = default_callback) {
    this._medium(medium).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// LAYERS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get layer by ID
  getLayer(layer, callback = default_callback) {
    this._layer(layer).get(callback);
  };

// Get list of layers
  getLayers(callback = default_callback, {returns_id,filter = {}, history} = {}) {
    // Available filters: id_corpus, name

    if (returns_id) {
      callback = _ID(callback);
    }

    if (history) {
      filter.history = history;
    }

    if (filter.id_corpus !== undefined) {
      var id_corpus = filter.id_corpus;
      delete filter.id_corpus;
      this._corpus(id_corpus)('layer')(filter).get(callback);
    } else {
      this._layer()(filter).get(callback);
    }

  };

  createLayer(corpus, name, description, fragment_type, data_type, annotations, callback = default_callback, {returns_id} = {}) {

    if (returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description || {};
    data.fragment_type = fragment_type;
    data.data_type = data_type;
    data.annotations = annotations || [];

    this._corpus(corpus)('layer').post(data, callback);

  };

  updateLayer(layer, fields = {}, callback = default_callback) {
    // Updatable fields: name?, description, fragment_type, data_type

    this._layer(layer).put(fields, callback);

  };

  deleteLayer(layer, callback = default_callback) {
    this._layer(layer).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ANNOTATIONS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getAnnotation(annotation, callback = default_callback, {history} = {}) {

    var filter = {};
    if (history) {
      filter.history = history;
    }

    this._annotation(annotation)(filter).get(callback);
  };

  getAnnotations(callback = default_callback, {returns_count, filter = {}, history, returns_id} = {}) {
    // Available filters: id_layer, id_medium

    // route /layer/:id_layer/annotation/count
    if (returns_count) {

      if (filter.id_layer === undefined) {
        callback('returns_count needs options.filter.id_layer to be set', null);
        return;
      }

      let id_layer = filter.id_layer;
      delete filter.id_layer;
      this._layer(id_layer)('annotation')('count')(filter).get(callback);

      return;
    }

    // returns ID instead of complete annotations
    if (returns_id) {
      callback = _ID(callback);
    }

    if (history) {
      filter.history = history;
    }

    if (filter.id_layer !== undefined) {
      let id_layer = filter.id_layer;
      delete filter.id_layer;
      this._layer(id_layer)('annotation')(filter).get(callback);
    } else {
      this._annotation()(filter).get(callback);
    }

  };

  createAnnotation(layer, medium, fragment = {}, data = {}, callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    var _data = {
      id_medium: medium,
      fragment,
      data
    };

    this._layer(layer)('annotation').post(_data, callback);

  };

  createAnnotations(layer, annotations, callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    this._layer(layer)('annotation').post(annotations, callback);

  };

  updateAnnotation(annotation, fields = {}, callback = default_callback) {
    // Updatable fields: fragment, data

    this._annotation(annotation).put(fields, callback);

  };

  deleteAnnotation(annotation, callback = default_callback) {
    this._annotation(annotation).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// QUEUES
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getQueue(queue, callback = default_callback) {
    this._queue(queue).get(callback);

  };

  getQueues(callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    this._queue().get(callback);

  };

  createQueue(name, description = {}, callback = default_callback, {returns_id} = {}) {
    if (returns_id) {
      callback = _ID(callback);
    }

    var data = {};
    data.name = name;
    data.description = description;

    this._queue().post(data, callback);

  };

  updateQueue(queue, fields, callback = default_callback) {
    // Updatable fields: name, description

    this._queue(queue).put(fields, callback);

  };

  enqueue(queue, elements, callback = default_callback) {
    this._queue(queue)('next').put(elements, callback);
  };

  dequeue(queue, callback = default_callback) {
    this._queue(queue)('next').get(callback);
  };

  pick(queue, callback = default_callback) {
    this._queue(queue)('first').get(callback);
  };

  pickAll(queue, callback = default_callback) {
    this._queue(queue)('all').get(callback);
  };

  pickLength(queue, callback = default_callback) {
    this._queue(queue)('length').get(callback);
  };

  deleteQueue(queue, callback = default_callback) {
    this._queue(queue).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// PERMISSIONS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getCorpusPermissions(corpus, callback = default_callback) {
    this._corpus(corpus)('permissions').get(callback);
  };

  setCorpusPermissionsForGroup(corpus, group, right, callback = default_callback) {
    var data = {
      'right': right
    };
    this._corpus(corpus)('group')(group).put(data, callback);
  };

  removeCorpusPermissionsForGroup(corpus, group, callback = default_callback) {
    this._corpus(corpus)('group')(group).delete(callback);
  };

  setCorpusPermissionsForUser(corpus, user, right, callback = default_callback) {
    var data = {
      'right': right
    };
    this._corpus(corpus)('user')(user).put(data, callback);
  };

  removeCorpusPermissionsForUser(corpus, user, callback = default_callback) {
    this._corpus(corpus)('user')(user).delete(callback);
  };

  getLayerPermissions(layer, callback = default_callback) {
    this._layer(layer)('permissions').get(callback);
  };

  setLayerPermissionsForGroup(layer, group, right, callback = default_callback) {
    var data = {
      'right': right
    };
    this._layer(layer)('group')(group).put(data, callback);
  };

  removeLayerPermissionsForGroup(layer, group, callback = default_callback) {
    this._layer(layer)('group')(group).delete(callback);
  };

  setLayerPermissionsForUser(layer, user, right, callback = default_callback) {
    var data = {
      'right': right
    };
    this._layer(layer)('user')(user).put(data, callback);
  };

  removeLayerPermissionsForUser(layer, user, callback = default_callback) {
    this._layer(layer)('user')(user).delete(callback);
  };

  getQueuePermissions(queue, callback = default_callback) {
    this._queue(queue)('permissions').get(callback);

  };

  setQueuePermissionsForGroup(queue, group, right, callback = default_callback) {
    var data = {
      'right': right
    };
    this._queue(queue)('group')(group).put(data, callback);
  };

  removeQueuePermissionsForGroup(queue, group, callback = default_callback) {
    this._queue(queue)('group')(group).delete(callback);
  };

  setQueuePermissionsForUser(queue, user, right, callback = default_callback) {
    var data = {
      'right': right
    };
    this._queue(queue)('user')(user).put(data, callback);
  };

  removeQueuePermissionsForUser(queue, user, callback = default_callback) {
    this._queue(queue)('user')(user).delete(callback);
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// META DATA
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// CORPUS
  getCorpusMetadata(corpus, path, callback) {
    this._getMetadata(this._corpus(corpus), path, callback);
  };

  getCorpusMetadataKeys(corpus, path, callback) {
    this._getMetadataKeys(this._corpus(corpus), path, callback);
  };

  setCorpusMetadata(corpus, metadatas, path, callback) {
    this._setMetadata(this._corpus(corpus), metadatas, path, callback);
  };

  sendCorpusMetadataFile(corpus, path, file, callback) {
    this._sendMetadataFile(this._corpus(corpus), path, file, callback);
  };

  deleteCorpusMetadata(corpus, path, callback) {
    this._deleteMetadata(this._corpus(corpus), path, callback);
  };

// LAYER
  getLayerMetadata(layer, path, callback) {
    this._getMetadata(this._layer(layer), path, callback);
  };

  getLayerMetadataKeys(layer, path, callback) {
    this._getMetadataKeys(this._layer(layer), path, callback);
  };

  setLayerMetadata(layer, metadatas, path, callback) {
    this._setMetadata(this._layer(layer), metadatas, path, callback);
  };

  msendLayerMetadataFile(layer, path, file, callback) {
    this._sendMetadataFile(this._layer(layer), path, file, callback);
  };

  deleteLayerMetadata(layer, path, callback) {
    this. _deleteMetadata(this._layer(layer), path, callback);
  };

// MEDIUM
  getMediumMetadata(medium, path, callback) {
    this._getMetadata(this._medium(medium), path, callback);
  };

  getMediumMetadataKeys(medium, path, callback) {
    this._getMetadataKeys(this._medium(medium), path, callback);
  };

  static setMediumMetadata(medium, metadatas, path, callback) {
    Camomile._setMetadata(this._medium(medium), metadatas, path, callback);
  };

  sendMediumMetadataFile(medium, path, file, callback) {
    this._sendMetadataFile(this._medium(medium), path, file, callback);
  };

  deleteMediumMetadata(medium, path, callback) {
    this._deleteMetadata(this._medium(medium), path, callback);
  };

////

  static _setMetadata(resource, metadatas, path, callback) {
    if (typeof (path) === 'function') {
      callback = path || default_callback;
    }

    callback = callback || default_callback;

    if (typeof (path) === 'string') {
      metadatas = Camomile._constructMetadataPathObject(path, metadatas);
    }

    resource('metadata').post(metadatas, callback);
  }

  static _getMetadata(resource, path, callback = default_callback) {
    if (typeof (path) === 'function') {
      Camomile._getMetadataKeys(resource, path);
    } else {
      resource('metadata')(path).get(callback);
    }
  }

  static _getMetadataKeys(resource, path, callback = default_callback) {
    if (typeof (path) === 'function') {
      callback = path;
      path = '';
    }

    resource('metadata')(path + '.').get(callback);
  }

  static _deleteMetadata(resource, path, callback = default_callback) {
    resource('metadata')(path).delete(callback);
  }

  _sendMetadataFile(resource, path, file, callback = default_callback) {
    var reader = new FileReader();
    reader.onload = (e) => {
      var base64 = e.target.result;
      var infos = base64.split(',');
      var object = Camomile._constructMetadataPathObject(path, {
        type: 'file',
        filename: file.name,
        data: infos[1]
      });

      this._setMetadata(resource, object, callback);
    };
    reader.readAsDataURL(file);
  }

  static _constructMetadataPathObject(path, metadatas) {
    var paths = path.split('.');

    var object = {};
    var accessor = object;
    for (var i = 0; i < paths.length; i++) {
      accessor[paths[i]] = {};
      if (i === paths.length - 1) {
        accessor[paths[i]] = metadatas;
      } else {
        accessor = accessor[paths[i]];
      }
    }

    return object;
  }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SSE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  listen(callback = default_callback) {
    this._api('listen').post({}, function (err, {channel_id}) {
      if (err) {
        return callback(err);
      }

      this._evSource = new EventSource(this._baseUrl + '/listen/' + channel_id, {withCredentials: true});

      callback(null, channel_id, new SseChannel(this._evSource, channel_id));
    });

    ////////////

    function SseChannel(_evSource, channel_id) {
      var t = this;

      t.watchCorpus = watch.bind(t, 'corpus');
      t.watchMedium = watch.bind(t, 'medium');
      t.watchLayer = watch.bind(t, 'layer');
      t.watchQueue = watch.bind(t, 'queue');

      ////////

      function watch(type, id, callback) {
        var jsonToObjectCallback = jsonToObject.bind(undefined, callback);
        this._api('listen')(channel_id)(type)(id)
          .put(
            createListener.bind(undefined, type, id, jsonToObjectCallback)
          );

        return unWatch.bind(t, type, id, jsonToObjectCallback);
      }

      function unWatch(type, id, callback) {
        this._api('listen')(channel_id)(type)(id)
          .delete(
            removeListener.bind(undefined, type, id, callback)
          );
      }

      function createListener(type, id, callback, err) {
        if (err) {
          return callback(err);
        }

        _evSource.addEventListener(type + ':' + id, callback);
      }

      function removeListener(type, id, callback, err) {
        if (err) {
          return callback(err);
        }

        _evSource.removeEventListener(type + ':' + id, callback);
      }

      function jsonToObject(callback, data) {
        if (data) {
          callback(null, JSON.parse(data.data));
        }
      }
    }
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// UTILS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getDate(callback = default_callback) {
    this._api('date').get(callback);
  };
}


module.exports = Camomile;