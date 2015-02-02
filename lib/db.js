var r        = require('project-base');
var level    = require('level');
var settings = require(r+'config/settings.js');

var _db = level(settings.dbPath, {
  valueEncoding: 'json'
});

function reset (callback) {
  _db.close();

  level.destroy(settings.dbPath, function(err) {
    if (err) return reply(err);
    _db = level(settings.dbPath, {valueEncoding: 'json'}); // re-create the database
    return callback(null);
  });
}

module.exports = {
  db: _db,
  reset: reset
};

