# yolowatch

Watch changes to subdirectories and subfiles within a given directory.

Uses the `filewatcher` module to fall back on polling the filesystem when ulimit is reached.

```
npm install yolowatch
```

### Example

```js
var yolowatch = require('yolowatch')

var watcher = yolowatch('/path/to/my/dir')

watcher.on('changed', function (file) {
  console.log(file.filepath, 'was changed')
  console.log('is a', file.type) //'file', 'directory'
})

watcher.on('deleted', function (file) {
  console.log(file.filepath, 'was deleted')
})

watcher.on('added', function (file) {
  console.log(file.filepath, 'was deleted')
})
```

### Todo

* expose options to pass to filewatcher module
