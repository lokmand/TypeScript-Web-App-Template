/* Node/Express Server used for development. You can use this script alone,
 * or withing the Docker development container. If you use this alone, you will
 * need to run `gulp watch` as a separate process.
 * 
 * How to use:
 * - $ node server.js (local|lan) (port)
 *
 * - $ node server.js
 * - $ node server.js local
 * - - Serves the content to http://localhost
 *
 * - $ node server.js lan
 * - - Serves the content to your local area network (e.g. http://192.168.1.174)
 *
 * - $ node server.js [lan|local] 8888
 * - - Serves content to a specified port (e.g. http://192/168.1.174:8888)
 *
 * You can also run this using:
 * - $ npm serve -- lan
 * - $ npm serve -- local
 * - $ npm serve 
 * - - Defaults to local
*/

const ip = require('ip');
const shell = require('shelljs');
const express = require('express');

/* Where to serve the app */
var localhost = {
	address: 'localhost',
	port: 8080
}

var lan = {
	address: ip.address(),
	port: 8080
}

/* Parse the args */
var net = localhost;
process.argv.forEach((val, idx) => {
  if(idx > 1) {
  	if(val == 'local') {
  		net = localhost;
  	} else if(val == 'lan') {
  		net = lan;
  	} else if(parseInt(val)) {
  		net.port = val;
  	}
  }
});

/* Express app setup */
const app = express();
app.use(express.static(__dirname + '/dist'));

/* Watch the files for changes */
var gulp_watch = shell.exec('gulp watch', {async:true});

/* Start the server */
app.listen(net.port, net.address, () => console.log(`==========\nApp listening on port http://${net.address}:${net.port}\n==========`));
