fsjs
====

Tiny opiniated web framework for [node](http://nodejs.org) that relies heavily on [fs](http://nodejs.org/api/fs.html). If [watch](http://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener) doesn't work, oops.

```js
require('fsjs')(3000)
exports.get = function(callback){
  callback('Hello World')
}
```

## Installation
    $ npm install -g fsjs
