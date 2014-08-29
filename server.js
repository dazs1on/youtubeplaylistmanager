
// Server Constructor
function Server( port )
{
   this.port = process.env.PORT || port;
    this.express = require('express');
    this.app = this.express.createServer();
} 

// Server methods
Server.prototype = {
    
    // we want the server to use html
    configure: function Server_configure () {
      var server = this;
      
        server.app.use(server.express.static(__dirname + '/public'));
        server.app.set('views', __dirname);
        
        // disable layout
        server.app.set("view options", {layout: false});
        
        server.app.register('.html', {
          compile: function(str, options){
            return function(locals){
              return str;
            };
          }
        });
    },
    
    // Direct to go to index.html     
    setRoutes: function Server_setRoutes () {
      this.app.get('/', function (req, res) {
        res.render('index.html');
      });
    },
    
    // Set to listen on port
    listen: function Server_listen () {
      var server = this;
      this.app.listen(this.port, function () {
        var addr = server.app.address();
        console.log('Listening on ' + addr.port+ '...');
      });    
    }
}


var server = new Server( 8080 );
server.configure();
server.setRoutes();
server.listen(process.env.PORT);