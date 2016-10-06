# Javascript client for Camomile REST API


## Usage

### HTML

```html
  <script type="text/javascript" src="camomile.js"></script>
```

### Javascript

```javascript
  var client = new Camomile('http://camomile.fr/api');
  client.login('username', 'password', callback);
  client.logout(callback);

  client.getCorpora(callback);
  client.createCorpus(...);

```

### Server Sent Event

```javascript

    client.listen(function(err, channel_id, eventSource) {
        var cancelWatcher = eventSource.watchCorpus(<corpus_id>, function(error, datas) {
            console.log(error, data);
        });
        
        // For unwatch Corpus :
        cancelWatcher();
    });
    
```

## Documentation

Will be available at http://camomile-project.github.io/camomile-server/ 
