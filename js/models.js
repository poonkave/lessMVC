var appModels = function () {
	var _data = { todos: [] };


	var Utils = {
		// https://gist.github.com/1308368
		uuid: function (a, b) { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'); return b },
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	this.todos = function () {
		return _data.todos;
	};
	this.get = function (request) {

		_data.todos = Utils.store("todos-lessMVC" + request.instanceId);
		request.onSuccess(_data.todos);
		return;

		//		$.ajax({
		//			url: "assets/get.php?id=" + request.instanceId
		//		}).done(function (response) {
		//			var _tmp = $.parseJSON(response).todos || [];
		//			for (var i = 0; i < _tmp.length; i++) {
		//				_tmp[i].completed = (_tmp[i].completed === 'true');
		//				_tmp[i].todo_id = (_tmp[i].todo_id * 1);
		//			}
		//			_data.todos = _tmp;
		//			request.onSuccess(_data.todos);
		//		});
	};
	this.insert = function (request) {

		var _tmp = { todo_id: 0 };
		_tmp.todo_id = Utils.uuid();

		_tmp.instanceId = request.instanceId;
		_tmp.title = request.title;
		_tmp.completed = false;
		_data.todos.push(_tmp);

		Utils.store("todos-lessMVC" + request.instanceId, _data.todos);

		request.onSuccess(_data.todos[_data.todos.length - 1]);

		//		
		//		$.ajax({
		//			url: "assets/insert.php",
		//			type: "POST",
		//			data: { title: request.title, instanceId: request.instanceId }
		//		}).done(function (response) {
		//			var _tmp = $.parseJSON(response) || [{ todo_id: 0}];
		//			if (_tmp.todo_id > 0) {
		//				_tmp.instanceId = request.instanceId;
		//				_tmp.title = request.title;
		//				_tmp.completed = false;
		//				_data.todos.push(_tmp);
		//				request.onSuccess(_data.todos[_data.todos.length - 1]);
		//			} else {
		//				request.onException(_tmp);
		//			}
		//		});
	};
	this.update = function (request) {
		for (var i = 0; i < _data.todos.length; i++) {
			if (_data.todos[i].todo_id == request.todo_id) {
				_data.todos[i].title = request.title || _data.todos[i].title;
				_data.todos[i].completed = request.completed == undefined ? _data.todos[i].completed : request.completed;
				break;
			}
		};

		Utils.store("todos-lessMVC" + request.instanceId, _data.todos);

		request.onSuccess(_data.todos[i]);

		//		$.ajax({
		//			url: "assets/edit.php?a=0",
		//			type: "POST",
		//			data: _data.todos[i]
		//		}).done(function (response) {
		//			var _tmp = $.parseJSON(response) || [{ todo_id: 0}];
		//			if (_tmp.todo_id > 0) {
		//				for (var i = 0; i < _data.todos.length; i++) {
		//					if (_data.todos[i].todo_id == _tmp.todo_id) {
		//						_data.todos[i].title = request.title || _data.todos[i].title;
		//						_data.todos[i].completed = request.completed == undefined ? _data.todos[i].completed : request.completed;
		//						break;
		//					}
		//				}
		//				request.onSuccess(_data.todos[i]);
		//			} else {
		//				request.onException(_tmp);
		//			}
		//		});
	};
	this.updateStatus = function (request) {
		var x;
		for (var i = 0; i < request.todos.length; i++) {
			for (x = 0; x < _data.todos.length; x++) {
				if (_data.todos[x].todo_id == request.todos[i].todo_id) {
					_data.todos[x].completed = request.completed;
				} 
			} 
		}

		Utils.store("todos-lessMVC" + request.instanceId, _data.todos);

		request.onSuccess({ completed: request.completed });

		//		var _todoIds = [];
		//		for (var i = 0; i < request.todos.length; i++) {
		//			_todoIds.push(request.todos[i].todo_id);
		//		}
		//		_todoIds += "";
		//		$.ajax({
		//			url: "assets/edit.php?a=2",
		//			type: "POST",
		//			data: { todoIds: _todoIds, completed: request.completed }
		//		}).done(function (response) {
		//			var _tmp = $.parseJSON(response) || [{ todoIds: []}];
		//			for (var i = 0; i < _data.todos.length; i++) {
		//				if ($.inArray((_data.todos[i].todo_id * 1), _tmp.todoIds) > -1) {
		//					_data.todos[i].completed = request.completed;
		//				}
		//			}
		//			if (_tmp.todoIds.length > 0) {
		//				request.onSuccess({ completed: request.completed });
		//			} else {
		//				request.onException(_tmp);
		//			}
		//		});
	};
	this.remove = function (request) {

		for (var i = 0; i < _data.todos.length; i++) {
			_todo = _data.todos[i];
			if ($.inArray((_todo.todo_id ), request.todoIds) > -1) {
				_data.todos.splice(i, 1);
				i--;
			}
		}
		Utils.store("todos-lessMVC" + request.instanceId, _data.todos);
		request.onSuccess(_data.todos);

//		$.ajax({
//			url: "assets/edit.php?a=1",
//			type: "POST",
//			data: { todoIds: (request.todoIds + "") }
//		}).done(function (response) {
//			var _tmp = $.parseJSON(response) || [{ todoIds: []}], _todo;
//			for (var i = 0; i < _data.todos.length; i++) {
//				_todo = _data.todos[i];
//				if ($.inArray((_data.todos[i].todo_id * 1), _tmp.todoIds) > -1) {
//					_data.todos.splice(i, 1);
//					i--;
//				}
//			}

//			if (_tmp.todoIds.length > 0) {
//				request.onSuccess(_data.todos);
//			} else {
//				request.onException(_tmp);
//			}
//		});
	};
	return this;
}; 

