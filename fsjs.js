var http = require('http')
, path = require('path')
, fs = require('fs')
, modules = {}
, reRequire = function(event,filename){
  var ext = path.extname(filename)
  , name = path.basename(filename,ext)
  modules[name] = require(filename)
}
, watchAll = function(dir,callback){
  fs.watch(dir,rerequire)
  callback()
}
, router = function(req,res){
  require.main.exports.get()
}
exports = function(port){
  watchAll(path.dirname(require.main.filename),function(){
    http.createServer(router).listen(port)
  })
}
