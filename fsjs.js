var http = require('http')
, path = require('path')
, fs = require('fs')
, url = require('url')
, dir = path.dirname(require.main.filename)
, requireAll = function(callback){
  if (typeof callback !== "function") callback = function(){}
  fs.readdir(dir,function(e,files){
    if (!e) files.forEach(function(filename,filenumber){
      var name = path.resolve(dir,filename)
      if (name === require.main.filename) return
      if (require.cache[name]) delete require.cache[name]
      try {
        require(name)
        console.log('Requiring '+name)
      }
      catch (e) {
        console.log('Error requiring '+name)
        console.log(e)
      }
      if (filenumber===files.length-1) callback()
    })
  })
}
module.exports = function(port){
  args = Array.prototype.slice.call(arguments)
  fs.watch(dir,requireAll)
  requireAll(function(){
    http.createServer(function(req,res){
      var urlparts = url.parse(req.url).pathname.split('/').slice(1)
      , method = req.method.toLowerCase()
      , callback = function(data){
        if (typeof data === 'string') res.write(data)
        else {
          res.writeHead(200,{"Content-Type":"application/json"})
          res.write(JSON.stringify(data))
        }
        res.end()
      }
      if (typeof args[args.length-1]==='function') {
        var newCallback = args[args.length-1]
        , oldCallback = callback
        callback = function(data){
          newCallback(data,function(data){
            oldCallback(data)
          })
        }
      }
      if (urlparts[urlparts.length-1]==="") urlparts.pop()
      args.slice(1).forEach(function(arg){
        if (!urlparts.length) return
        if (require.cache[path.resolve(dir,urlparts[0]+".js")]) return
        if (typeof arg !== "string") return
        this[arg] = urlparts.shift()
      })
      this.request = req
      this.result = res
      if ((modu=require.cache[path.resolve(dir,urlparts[0]+'.js')])) {
        modu.exports[method].apply(this,urlparts.slice(1).concat([callback]))
      }
      else require.main.exports[method].apply(this,urlparts.concat([callback]))
    }).listen(port)
  })
}
