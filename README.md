fsjs
====

Tiny opiniated web framework for [node](http://nodejs.org) that relies heavily on [fs](http://nodejs.org/api/fs.html). If [watch](http://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener) doesn't work, oops.

```js
require('fsjs')(8000)
exports.get = function(callback){
  callback('Hello World')
}
```

## Installation
    $ npm install -g fsjs

## What it does
fsjs watches the current application's entry point directory for changes, and requires all modules
```
$ ls
edit.js
app.js
$ cat app.js
require('fsjs')(8000)
$ node app.js
```
It handles urls like '/edit/master' by calling edit.js's exported method
```js
exports.get = function(branch,callback) {
  console.log(branch)
// master
  callback('Edited!')
}
```
The default callback writes the data to res, stringifying it if it is an object. You can pass your own callback if you like (in your main file, say app.js):
```js
require('fsjs')(8000,function(data,defaultCallback){
  defaultCallback('<!doctype html>'+JSON.stringify(data))
})
```
You can also pass names for arguments in the url before the module name:
```js
require('fsjs')(8000,'user','repo',callback)
```
They are passed as properties of this to your module, so '/arpith/fsjs/edit/master/README.md' can be handled by edit.js:
```js
exports.get = function(branch,file) {
  var callback = arguments[arguments.length-1]
  console.log(this.user)
// arpith
  console.log(this.repo)
// fsjs
  console.log(branch)
// master
  console.log(file)
// README.md
  callback('done')
}
```
It also handles smaller urls (say '/arpith/edit') as expected:
```js
exports.get = function(){
  console.log(this.user)
// arpith
  console.log(this.repo)
// undefined
}
```
Finally, this also has the request and response that http.createServer passes:
```js
exports.get = function(){
  console.log(this.request.url)
// /arpith/fsjs/edit/master/readme.md
  console.log(typeof this.response)
// object
}
```
