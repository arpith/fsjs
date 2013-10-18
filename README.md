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
fsjs watches the current application's entry point directory for changes, and requires all files ending with '.js'
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
  console.log(this.response.statusCode)
// 200
}
```
## License
The MIT License (MIT)

Copyright (c) 2013 Arpith Siromoney <arpith@feedreader.co>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
