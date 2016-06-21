var filewatcher = require('filewatcher')
var from = require('from2')
var each = require('stream-each')
var path = require('path')
var walker = require('folder-walker')

module.exports = function yoloWatch (root) {
  var stats = {}
  var dirs = filewatcher()
  dirs.on('change', kick)
  dirs.add(root)
  kick(root)

  var watcher = filewatcher()
  return from.obj(read)

  function read (size, cb) {
    watcher.on('change', function (filepath, stat) {
      fileChanged(filepath, stat, cb)
    })
  }

  function kick (dir) {
    var fileStream = walker(dir)
    each(fileStream, function (data, next) {
      if (!stats[data.filepath]) watcher.add(data.filepath)
      stats[data.filepath] = data
      next()
    }, function (err) {
      if (err) throw err
    })
  }

  function fileChanged (filepath, stat, cb) {
    var item = {
      root: root,
      filepath: filepath,
      stat: stat,
      relname: root === filepath ? path.basename(name) : path.relative(root, filepath),
      basename: path.basename(filepath)
    }
    if (!stat || stat.deleted) item.type = 'deleted'
    else if (stat.isFile()) {
      item.type = 'file'
    }
    else if (stat.isDirectory()) item.type = 'directory'

    cb(null, item)
  }
}
