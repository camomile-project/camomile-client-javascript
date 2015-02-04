# Javascript client for Camomile REST API


## Usage

### HTML

```html
  <script type="text/javascript" src="camomile.js"></script>
  <script type="text/javascript" src="fermata.js"></script>
```

### Javascript

```javascript
  
  camomile.login('username', 'password', 'http://camomile.fr/api' [, callback]);
  camomile.logout();

  camomile.getCorpora(callback);
  camomile.createCorpus(...);

```
