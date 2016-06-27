var fs = require('fs')
var os = require('os')
var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var yoloWatch = require('.')

var dir = path.join(os.tmpdir(), 'yolotest')
var opts = {persistent: false}

var i = 0
var fStart
var watcher

test('prep', function (t) {
  rimraf(dir, function () {
    fs.mkdirSync(dir)
    fStart = createFile()
    watcher = yoloWatch(dir, opts)
    t.end()
  })
})

test('file is updated', function (t) {
  watcher.on('changed', function (file, data) {
    t.plan(2)
    if (file !== fStart) return false
    t.equal(file, fStart)
    t.ok(data.stat.mtime > 0, 'mtime > 0')
  })
  touch(fStart)
})

test('new file added', function (t) {
  var f
  f = createFile()
  watcher.on('added', function (file, data) {
    if (file !== f) return false
    t.equal(file, f)
    t.end()
  })
})

function createFile () {
  var n = path.join(dir, 'tmp00' + (i++))
  fs.writeFileSync(n, Date.now())
  return n
}

function touch (f) {
  setTimeout(function () { fs.writeFileSync(f, Date.now()) }, 1000)
}
