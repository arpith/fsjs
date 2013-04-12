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
module.exports = function(port){
  var dir = path.dirname(require.main.filename)
  , args = Array.prototype.slice.call(arguments)
  requireAll(dir,function(){
    fs.watch(dir,requireAgain)
    http.createServer(function(req,res){
      var urlparts = url.parse(req.url,true).pathname.split('/')
      , method = req.method.toLowerCase()
      , callback = function(data){
        if (typeof data === 'string') res.write(data)
        else {
          res.writeHead(200,{"Content-Type":"application/json"})
          res.write(JSON.stringify(data))
        }
        res.end()
      }
      if (typeof args[args.length-1]==='function') callback = function (data) {
        var newCallback = args.pop
        newCallback(data,callback)
      }
      args.slice(1).forEach(function(arg){
        if (!urlparts.length) return
        if (require.cache[urlparts[0]]) return
        this[arg] = urlparts.shift()
      })
      if (((name=urlparts[0]))&&(require.cache[name])) require.cache[name].method.apply(this,urlparts.slice(1).concat(callback))
      else require.main.exports.method.apply(this,urlparts.concat(callback))
    }).listen(port)
  })
}
