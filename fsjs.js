var http = require('http')
, path = require('path')
, fs = require('fs')
, url = require('url')
, dir = path.dirname(require.main.filename)
, requireFile = function(filename,callback){
  var name = path.resolve(dir,filename)
  if (name != require.main.filename) {
    if (path.extname(name) === '.js') {
      if (require.cache[name]) delete require.cache[name]
      try {
        require(name)
        console.log('Requiring '+name)
      }
      catch (e) {
        console.log('Error requiring '+name)
      }
    }
  } 
  if (callback) callback()
}
, requireDirectory = function(callback){
  fs.readdir(dir,function(e,files){
    if (e) console.log('Error reading '+dir)
    else {
      files.forEach(function(filename,filenumber){
        requireFile(filename,function(){
          if (filenumber === files.length-1) callback()
        })
      })
    }
  })
}
, watchDirectory = function(){
  fs.watch(dir,function(event,filename){
    requireFile(filename)
  })
}
module.exports = function(port){
  var args = Array.prototype.slice.call(arguments)
  watchDirectory()
  requireDirectory(function(){
    http.createServer(function(req,res){
      var urlparts = url.parse(req.url).pathname.split('/').slice(1)
      , method = req.method.toLowerCase()
      , defaultCallback = function(data){
        if (typeof data === 'string') res.write(data)
        else {
          res.writeHead(200,{"Content-Type":"application/json"})
          res.write(JSON.stringify(data))
        }
        res.end()
      }
      if (typeof args[args.length-1]==='function') callback = function(data){
        args[args.length-1](data,defaultCallback)
      }
      else callback = defaultCallback
      if (urlparts[urlparts.length-1]==="") urlparts.pop()
      args.slice(1).forEach(function(arg){
        if (!urlparts.length) return
        if (require.cache[path.resolve(dir,urlparts[0]+".js")]) return
        if (typeof arg !== "string") return
        this[arg] = urlparts.shift()
      })
      this.request = req
      this.response = res
      var modu = require.cache[path.resolve(dir,urlparts[0]+'.js')]
      if (modu && modu.exports[method]) {
        modu.exports[method].apply(this,urlparts.slice(1).concat([callback]))
      }
      else if (require.main.exports[method]) {
	    require.main.exports[method].apply(this,urlparts.concat([callback]))
      }
      else callback("oops")
    }).listen(port)
  })
}
