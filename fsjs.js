var http = require('http')
, path = require('path')
, fs = require('fs')
, modules = {}
, requireAgain = function(event,filename){
  var ext = path.extname(filename)
  , name = path.basename(filename,ext)
  modules[name] = require(filename)
}
, requireAll = function(dir,callback){
  fs.readdir(dir,function(e,files){
    if (!e) files.forEach(function(filename,filenumber){
      requireAgain('rename',filename)
      if (filenumber===files.length-1) callback()
    })
  })
}
, router = function(req,res){
  require.main.exports.get()
}
exports = function(port){
  var dir = path.dirname(require.main.filename)
  requireAll(dir,function(){
    fs.watch(dir,requireAgain)
    http.createServer(router).listen(port)
  })
}
