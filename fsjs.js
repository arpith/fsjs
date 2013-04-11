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
exports = function(port){
  var callback = null
  , dir = path.dirname(require.main.filename)
  if (typeof arguments[arguments.length-1]==='function') callback = Array.prototype.slice.call(arguments).pop()
  requireAll(dir,function(){
    fs.watch(dir,requireAgain)
    http.createServer(function(req,res){
      var urlparts = url.parse(req.url,true).pathname.split('/')
      , method = req.method.toLowerCase()
      if (!callback) callback = function(data){
        if (typeof data === 'string') res.write(data)
        else {
          res.writeHead(200,{"Content-Type":"application/json"})
          res.write(JSON.stringify(data))
        }
        res.end()
      }
      if (((name=urlparts[0]))&&(require.cache[name])) require.cache[name].method.apply(this,urlparts.slice(1),callback)
      else require.main.exports.method.apply(this,urlparts,callback)
    }).listen(port)
  })
}
