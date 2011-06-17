var assert = require('assert');
var findit = require('findit');

exports.cycle = function () {
    var find = findit.find(__dirname + '/cycle');
    var found = { directory : [], link : [], file : [] };
    
    find.on('directory', function (dir, stat) {
        assert.ok(stat.isSymbolicLink());
        found.directory.push(dir);
    });
    
    find.on('link', function () {
        found.link.push(dir);
    });
    
    find.on('file', function (file) {
        found.file.push(dir);
    });
    
    var to = setTimeout(function () {
        assert.fail('never ended');
    }, 5000);
    
    find.on('end', function () {
        clearTimeout(to);
        
        assert.deepEqual(found, {
            directory : [ 'meep', 'meep/moop' ],
            link : [ 'meep/moop' ],
            file : []
        });
    });
};
