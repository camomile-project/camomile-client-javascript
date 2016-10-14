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

var client=new Camomile(host);
client.login(user, password, function(err,result) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(result);

  client.me(function(err,data) {
    if(err) {
      console.log(err);
      return;
    }
    console.log(data)
  });
});
