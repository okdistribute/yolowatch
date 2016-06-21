var filewatcher = require('filewatcher')
var from = require('from2')
var events = require('events')
var each = require('stream-each')
var path = require('path')
var walker = require('folder-walker')

module.exports = function yoloWatch (root) {
  var yolo = new events.EventEmitter()
  var stats = {}
  var dirs = filewatcher()
  dirs.on('change', function () {
    kick(root, false)
  })
  dirs.add(root)
  kick(root, true)

  var watcher = filewatcher()
  watcher.on('change', fileChanged)
  return yolo

  function kick (dir, first) {
    // find any new files
    var fileStream = walker(dir)
    each(fileStream, function (data, next) {
      if (!stats[data.filepath]) {
        // new file
        if (!first) yolo.emit('added', data)
        watcher.add(data.filepath)
      }
      stats[data.filepath] = data
      next()
    }, function (err) {
      if (err) throw err
    })
  }

  function fileChanged (filepath, stat) {
    if (!stat || stat.deleted) {
      stats[filepath] = null
      yolo.emit('deleted', info)
    }
    else {
      stats[filepath].stat = stat
      yolo.emit('changed', item)
    }
  }
}
