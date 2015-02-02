var r         = require('project-base');
var _         = require('lodash');
var db        = require(r+'lib/db.js').db;
var timestamp = require('monotonic-timestamp');

// Beginning and ending ascii characters for delimiters
var B = '\x00';
var E = '\xff';

// Anything you want to filter on must be included in the key, otherwise your
// query efficiency will be very low.

function encodeKey(id) {
  return ['todos', id].join(E);
}

function decodeKey(string) {
  var split = string.split(E);

  return {
    table: split[0],
    id: split[1]
  };
}

module.exports.create = function(request, reply) {
  var id = timestamp();
  var key = encodeKey(id);
  var value = {
    isComplete: request.payload.isComplete,
    text: request.payload.text
  };

  db.put(key, value, function(err) {
    if (err) return reply(err);
    return reply({
      message: 'saved',
      todos: {
        id: id,
        isComplete: request.payload.isComplete,
        text: request.payload.text
      }
    });
  });
};

module.exports.show = function (request, reply) {
  var id = request.params.id;

  db.get(encodeKey(id), function (err, value) {
    if (err) return reply(err);
    return reply({
      todos: _.merge({id: id}, value)
    });
  });
};

module.exports.list = function (request, reply) {
  var result = [];

  db.createReadStream()
    .on('data', function (data) {
      var decoded = decodeKey(data.key);

      // TODO: bad way to filter
      if (decoded.table !== 'todos') return false;

      // Merge in the id that was embedded in the key
      result.push(_.merge({id: decoded.id}, data.value));
    })
    .on('error', function (err) {
      return reply(err);
    })
    .on('end', function () {
      return reply({
        todos: result
      });
    });
};

