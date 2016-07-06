var filewatcher = require('filewatcher')
var events = require('events')
var each = require('stream-each')
var walker = require('folder-walker')

module.exports = function yoloWatch (root, opts) {
  var filter = opts && opts.filter || function (filename) { return true }
  var yolo = new events.EventEmitter()
  var stats = {}
  var dirs = filewatcher(opts)
  dirs.on('change', function () {
    kick(root, false)
  })
  dirs.add(root)
  kick(root, true)

  var watcher = filewatcher(opts)
  watcher.on('change', fileChanged)

  yolo.close = function () {
    dirs.removeAll()
    watcher.removeAll()
  }

  return yolo

  function kick (dir, first) {
    // find any new files
    var fileStream = walker(dir, {filter: filter})
    each(fileStream, function (data, next) {
      if (!stats[data.filepath]) {
        // new file
        if (!first) yolo.emit('added', data.filepath, data)
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
      yolo.emit('deleted', filepath)
    } else {
      stats[filepath].stat = stat
      yolo.emit('changed', filepath, stats[filepath])
    }
  }
}
