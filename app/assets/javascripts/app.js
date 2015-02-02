'use strict';

var qwest = require('qwest');
var Cycle = require('cyclejs');
var Rx = Cycle.Rx;
var h = Cycle.h;

var TodosModelSource = Cycle.createDataFlowSource({
  todosData$: Rx.Observable.fromPromise(qwest.get('/todos'))
});

var HelloModel = Cycle.createModel(function (intent, initial) {
  return {
    name$: intent.get('changeName$').startWith(''),
    todos$: initial.get('todosData$').map(function (x) { return JSON.parse(x).todos; } )
  };
});

var HelloView = Cycle.createView(function (model) {
  return {
    vtree$: model.get('name$').map(function (name) {
      return h('div', [
        h('label', 'Name:'),
        h('input', {
          attributes: {'type': 'text'},
          oninput: 'inputText$'
        }),
        h('h1', 'Hello ' + name)
      ])
    })
  }
});

var TodosView = Cycle.createView(function (model) {
  return {
    vtree$: model.get('todos$').map(function (todos) {
      return h('div', {},
        todos.map(function(todo) {
          return h('div', {}, [ todo.text, todo.id ])
        })
      )
    })
  }
})

var HelloIntent = Cycle.createIntent(function (view) {
  return {
    changeName$: view.get('inputText$').map(function (ev) {
      return ev.target.value;
    })
  }
});

Cycle.createRenderer('#todo-app').inject(TodosView);

HelloIntent.inject(HelloView);
HelloView.inject(HelloModel);
HelloModel.inject(HelloIntent, TodosModelSource);

TodosView.inject(HelloModel);

