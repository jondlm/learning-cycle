var r  = require('project-base');
var db = require(r+'lib/db.js');

module.exports.index = function(request, reply) {
  reply({ message: 'welcome to hyrda, visit /docs for more info' });
};

module.exports.destroyAll = function(request, reply) {
  db.reset(function (err) {
    if (err) return reply(err);
    return reply({message: 'all database records deleted'});
  });
};

