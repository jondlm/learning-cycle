var r        = require('project-base');
var Joi      = require('joi');
var Hapi     = require('hapi');
var settings = require(r+'config/settings.js');

// Controllers
var applicationController = require(r+'app/controllers/application_controller.js');
var todosController = require(r+'app/controllers/todos_controller.js');

// Schema
var todoSchema = Joi.object().keys({
  isComplete: Joi.bool().required(),
  text: Joi.string().min(1).required()
});

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: applicationController.index
  },
  {
    method: 'GET',
    path: '/destroy_all',
    handler: applicationController.destroyAll
  },
  {
    method: 'GET',
    path: '/todos',
    handler: todosController.list
  },
  {
    method: 'GET',
    path: '/todos/{id}',
    handler: todosController.show,
    config: {
      validate: {
        params: {
          id: Joi.number().integer()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/todos',
    handler: todosController.create,
    config: {
      validate: { payload: todoSchema }
    }
  }
];
