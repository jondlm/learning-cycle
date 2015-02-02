var r  = require('project-base');
var db = require(r+'lib/db.js');

module.exports.index = function(request, reply) {
  reply.file(r+'app/views/index.html');
};

module.exports.destroyAll = function(request, reply) {
  db.reset(function (err) {
    if (err) return reply(err);
    return reply({message: 'all database records deleted'});
  });
};

