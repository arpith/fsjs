var path = require('path')
, http = require('http')
exports = function(port){
  http.createServer(require.main.exports.get).listen(port)
}
