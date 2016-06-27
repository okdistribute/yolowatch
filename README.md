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

watcher.on('changed', function (file, data) {
  console.log(file, 'was changed')
  console.log('is a', data.type) //'file', 'directory'
})

watcher.on('deleted', function (file) {
  console.log(file, 'was deleted')
})

watcher.on('added', function (file, data) {
  console.log(file, 'was added')
})
```

Example `data` in callback (see folder-walker):

```
{
  basename: 'index.js',
  relname: 'test/index.js',
  root: '/Users/karissa/dev/node_modules/folder-walker',
  filepath: '/Users/karissa/dev/node_modules/folder-walker/test/index.js',
  stat: [fs.Stat Object],
  type: 'file' // or 'directory'
}
```

### Todo

* expose options to pass to filewatcher module
* function to remove directory & children from being watched.
