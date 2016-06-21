# yolowatch

Watch filesystem changes yolostyle.

```
npm install yolowatch
```

### example

```js
var yolowatch = require('yolowatch')

var watcher = yolowatch('/path/to/my/dir')
watcher.on('data', function (file) {
  console.log(file.filepath, 'was added or modified')
  console.log('is a', file.type) //'file', 'directory', or 'deleted'
})
```

