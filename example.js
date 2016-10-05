/*
 * A basic simple showing how to setup the Camomile client
 * and use a camomile method
 */

var Camomile = require('.');

if(process.argv.length < 4 || process.argv.length > 6) {
  console.log("Usage : node example.js <host> <user> <password>");
  process.exit(1);
}

var host=process.argv[2];
var user=process.argv[3];
var password=process.argv[4];

Camomile.setURL(host);
Camomile.login(user, password, function(err,result,b) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(result);

  Camomile.me(function(err,data) {
    if(err) {
      console.log(err);
      return;
    }
    console.log(data)
  });
});
