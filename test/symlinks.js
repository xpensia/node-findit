var assert = require('assert');
var path = require('path');
var find = require('../').find;

exports.dangling_symlink = function () {
    var to = setTimeout(function () {
        assert.fail('never ended');
    }, 5000);

    var file_found_via_callback = false;
    var file_found_via_event = false;

    var finder = find(__dirname + '/symlinks', function(file, stat) {
        assert.eql('dangling-symlink', path.basename(file));
        assert.ok(stat.isSymbolicLink());
        file_found_via_callback = true;
    });

    finder.on('link', function (file, stat) {
        assert.eql('dangling-symlink', path.basename(file));
        assert.ok(stat.isSymbolicLink());
        file_found_via_event = true;
    });

    finder.on('file', function (dir) {
        assert.fail(dir);
    });

    finder.on('directory', function (dir) {
        assert.fail(dir);
    });

    finder.on('error', function (err) {
        assert.fail(err);
    });

    finder.on('end', function () {
        clearTimeout(to);
        assert.ok(file_found_via_callback);
        assert.ok(file_found_via_event);
    });
};
