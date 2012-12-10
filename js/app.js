
var App = (function () {
	//common across all instances.
	var INSTANCEID = 1, ENTER_KEY = 13, COUNTER = -1;
	//self executing for every instance.
	return function () {
		var _instanceId = INSTANCEID++, _Model,
		_instance = this, _cache = { _instance: 0, newId: 0 },
		_viewArguments = function () { return { config: {}, data: {}, listeners: {}} },
		_newTodo = function (response) {
			var _request = {}, todoCounter = response.id,
				_mask = appViews.mask.apply(_instance, [{ renderTo: _cache.container}]);
			_request.instanceId = _instanceId;
			var _title = response.title;
			_request.title = _title;

			_request.onSuccess = function (newToDo) {
				_injectTodo([newToDo]);
				_mask.hide();
			}
			_request.onException = function (response) {
				_mask.hide();
			}

			_Model.insert(_request);
		},
		_injectTodo = function (newtodos) {
			var _arguments = new _viewArguments();
			_arguments.listeners.onComplete = function (response) {
				_toggleCompleted(response);
			};

			_arguments.listeners.onRemove = _removeTodos;
			_arguments.listeners.onEdit = function (response) {
				var _title = response[0].title;
				if (_title == "") {//delete
					_removeTodos([response[0].todo_id]);
				} else {//update
					_editTodo(response);
				}
			};
			_arguments.data.todos = newtodos;
			_arguments.config.container = _cache.container;
			appViews.inject.apply(_instance, [_arguments]);
			_resetFooter();
		},
		_toggleCompleted = function (response) {
			var _mask = appViews.mask.apply(_instance, [{ renderTo: _cache.container}]),
				_request = {};

			_request.todo_id = response.todo_id;
			_request.instanceId = _instanceId;
			_request.completed = response.completed;
			_request.onSuccess = function (response) {
				_mask.hide(); 
				_resetFooter();
			}
			_request.onException = function (response) {
				_mask.hide();
			}
			_Model.update(_request);
		},
		_editTodo = function (response) {
			var _mask = appViews.mask.apply(_instance, [{ renderTo: _cache.container}]);

			var _request = {};

			_request.todo_id = response[0].todo_id;
			_request.title = response[0].title;
			_request.instanceId = _instanceId;
			_request.onSuccess = function (response) {
				_mask.hide();
				_resetFooter();
			}
			_request.onException = function (response) {
				_mask.hide();
			}
			_Model.update(_request);
		},
		_removeTodos = function (todoIds) {
			var _mask = appViews.mask.apply(_instance, [{ renderTo: _cache.container}]);
			var _request = { "todoIds": todoIds };
			_request.instanceId = _instanceId;

			_request.onSuccess = function (response) { 
				_resetFooter();
				_mask.hide();
			};

			_request.onException = function (response) {
				_mask.hide();
			}
			_Model.remove(_request);
		},
		_completeAllTodos = function (response) {
			var _mask = appViews.mask.apply(_instance, [{ renderTo: _cache.container}]);
			 
			var _request = {};
			_request.instanceId = _instanceId;
			_request.todos = _Model.todos();
			_request.completed = response.checked;

			_request.onSuccess = function (response) {
				_mask.hide();
				var _arguments = new _viewArguments();
				_arguments.data.completed = response.completed;
				_arguments.config.container = _cache.container;
				appViews.completeAll.apply(_instance, [_arguments]); 
				_resetFooter();
			}
			_request.onException = function (response) {
				_mask.hide();
			}
			_Model.updateStatus(_request);
		},
		_clearCompletedTodos = function () {
			var _todoIds = [], _todos = _Model.todos();
			for (var i = 0; i < _todos.length; i++) {
				if (_todos[i].completed) {
					_todoIds.push(  _todos[i].todo_id );
				}
			}
			var _arguments = new _viewArguments();
			_arguments.data.todoIds = _todoIds;
			_arguments.config.container = _cache.container;
			appViews.remove.apply(_instance, [_arguments]);

			_removeTodos(_todoIds);
		},
		_resetFooter = function () {
			var _arguments = new _viewArguments();
			_arguments.data.todos = _Model.todos();
			_arguments.config.container = _cache.container;
			appViews.headerFooter.apply(_instance, [_arguments]);
		}

		this.enterKey = function () {
			return ENTER_KEY;
		}
		this.counter = function () {
			return COUNTER--;
		} 
		this.init = function (config) {
			_Model = new appModels(); 
			_cache.container = config.renderTo;
			this.labels = config.labels;

			var _arguments = new _viewArguments();
			_arguments.config.$renderTo = config.renderTo;
			_arguments.listeners.onCreate = function (response) {
				_newTodo(response);
			}

			_arguments.listeners.onCompleteAll = _completeAllTodos;
			_arguments.listeners.onClearCompleted = _clearCompletedTodos;

			appViews.render.apply(_instance, [_arguments]);
			var _mask = appViews.mask.apply(_instance, [{ renderTo: _cache.container}]);
			//_arguments = {onSuccess:{},onException:{}};
			var _request = {};
			_request.instanceId = _instanceId;

			_request.onSuccess = function (response) {
				//pass this to view  
				_injectTodo(response);
				_mask.hide();
			}
			_request.onException = function (response) {
				_mask.hide();
			}
			_Model.get(_request);
		};

	};
})();