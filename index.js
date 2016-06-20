var filewatcher = require('filewatcher')
var each = require('stream-each')
var path = require('path')
var walker = require('folder-walker')

module.exports = function yoloWatch (root, onchange) {
  var stats = {}

  var dirs = filewatcher()
  var watcher = filewatcher()
  watcher.on('change', fileChanged)
  dirs.add(root)
  kick(root)
  dirs.on('change', function (dir, stat) {
    kick(dir)
  })

  function kick (dir) {
    var fileStream = walker(dir, {filter: function (data) {
      return data.indexOf('.dat') === -1
    }})
    each(fileStream, function (file, next) {
      if (!stats[file.filepath]) watcher.add(file.filepath)
      stats[file.filepath] = file
      next()
    }, function (err) {
      if (err) throw err
    })
  }

  function fileChanged (filepath, stat) {
    var type = 'modified'
    if (!stat) {
      type = 'deleted'
      stats[filepath] = null
    }
    else stats[filepath].stat = stat
    onchange({
      root: root,
      filepath: filepath,
      stat: stat,
      relname: root === filepath ? path.basename(name) : path.relative(root, filepath),
      basename: path.basename(filepath)
    })
  }
}
