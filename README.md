# Javascript client for Camomile REST API

[![NPM version](https://img.shields.io/npm/v/camomile-client.svg)](https://www.npmjs.com/package/camomile-client)

## Installation

`npm install camomile-client`

## Usage

### HTML

```html
  <script type="text/javascript" src="camomile.js"></script>
```

### Javascript

```javascript
  var client = new Camomile('http://camomile.fr/api');
  client.login('username', 'password');
  client.logout();

  client.getCorpora();
  client.createCorpus(...);

```

### Server Sent Event

```javascript
    client.listen().then(sseChannel => {
        var cancelWatcher = sseChannel.watchCorpus(<corpus_id>, function(error, data) {
            console.log(error, data);
        });
        
        // To unwatch the corpus :
        cancelWatcher();
    });
```

## Documentation

Will be available at http://camomile-project.github.io/camomile-server/ 
