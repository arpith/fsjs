var http = require('http')
, path = require('path')
, fs = require('fs')
, url = require('url')
, requireAgain = function(event,filename){
  var ext = path.extname(filename)
  , name = path.basename(filename,ext)
  if (require.cache[name]) delete require.cache[name]
  require(filename)
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
  var urlObject = url.parse(req.url,true)
  , parts = urlObject.pathname.split('/')
  , method = req.method.toLowerCase()
  if (((name=parts[0]))&&(require.cache[name])) require.cache[name].method.apply(this,parts.slice(1))
  else require.main.exports.method.apply(this,parts)
}
exports = function(port){
  var dir = path.dirname(require.main.filename)
  requireAll(dir,function(){
    fs.watch(dir,requireAgain)
    http.createServer(router).listen(port)
  })
}
