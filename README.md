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

See [listen.js](examples/listen.js)

```javascript
var client=new Camomile('http://camomile.fr/api');
client
  .login('username', 'password')
  .then(result =>  {
    console.log(result);
    return client.watchCorpus(corpusId, function(error, data) {
      console.log(error, data);
    });
  })
  .then(cancelWatcher => {
      // To unwatch the corpus :

      //cancelWatcher();
    })
  .catch(err => console.log(err));
```

## Documentation

Will be available at http://camomile-project.github.io/camomile-server/ 
