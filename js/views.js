var appViews = (function () {
	var _todoStructure, _todoTemplate;

	return {
		render: function (param) {
			var APP = this;
			_todoStructure = _todoStructure || Handlebars.compile($('#todo-structure').html());
			var _ui = $(_todoStructure(this.labels));
			_ui.find(".toggle-all").on("click", function () {
				param.listeners.onCompleteAll({ checked: this.checked });
			});
			var _todoList = _ui.find(".todo-list");
			_clearCompleted = _ui.find(".clear-completed");

			_clearCompleted.on("click", function () {
				$(this).hide();
				param.listeners.onClearCompleted();
			});

			_ui.find(".new-todo").on("keyup", function (e) {
				var $input = $(this),
				val = $.trim($input.val());
				if (e.which !== APP.enterKey() || !val) {
					return;
				}
				$input.val('');
				param.listeners.onCreate({
					id: APP.counter(),
					title: val,
					completed: false
				});
			});
			param.config.$renderTo.empty().append(_ui);

		},
		inject: function (param) { 
			var APP = this, _todoList = param.config.container.find(".todo-list");
			_todoTemplate = _todoTemplate || Handlebars.compile($('#todo-template').html());
			var $todos = $(_todoTemplate(param.data.todos));

			$todos.find(".toggle").on("change", function () {
				var _checked = this.checked, _li = $(this).closest("LI"), _input = _li.find();
				if (_checked) {
					_li.addClass("completed");
				} else {
					_li.removeClass("completed");
				}
				param.listeners.onComplete({ todo_id: (_li.attr("data-id")), completed: _checked });
			});

			$todos.find("label").on("dblclick", function () {
				$(this).closest('li').addClass('editing').find('.edit').focus();
			});
			$todos.find(".edit").on("blur", function () {
				var _li = $(this).closest('li'), _todoId = _li.attr("data-id");
				_title = $.trim($(this).val());
				if (_title == "") {
					_li.remove();
				} else {
					_li.removeClass('editing');
					_li.find("label").html(_title);
				}
				param.listeners.onEdit([{ todo_id: (_todoId ), title: _title}]);
			});
			$todos.find(".edit").on("keypress", function (e) {
				if (e.keyCode === APP.enterKey()) {
					e.target.blur();
				}
			});
			$todos.find(".destroy").on("click", function (e) {
				var _li = $(this).closest("LI"), _todoId = _li.attr("data-id");
				_li.remove();
				param.listeners.onRemove([(_todoId )]);
			});
			_todoList.append($todos);
		},
		completeAll: function (param) {
			var _todoUL = param.config.container.find(".todo-list");
			if (param.data.completed) {
				_todoUL.find("LI").addClass("completed");
				_todoUL.find(".toggle").attr("checked", "checked");
			} else {
				_todoUL.find("LI").removeClass("completed");
				_todoUL.find(".toggle").removeAttr("checked");
			}
		},
		remove: function (param) {
			var _todoLIs = param.config.container.find(".todo-list LI"),
				 _todo_id = 0, _li;


			_todoLIs.each(function () {
				_li = $(this);
				_todo_id = _li.attr("data-id") ;
				if ($.inArray(_todo_id, param.data.todoIds) > -1) {
					_li.remove();
				}
			});
		},
		headerFooter: function (param) {
			var _clearCompleted = param.config.container.find(".clear-completed"), APP = this,
				_todoCounter = param.config.container.find(".todo-count"),
				_toggleAll = param.config.container.find(".toggle-all");

			_itemsCompleted = 0, _itemsLeft = 0;
			for (var i = 0; i < param.data.todos.length; i++) {
				if (param.data.todos[i].completed) {
					_itemsCompleted++;
				}
			}

			if (_itemsCompleted === 0) {
				_clearCompleted.hide();
			} else {
				_clearCompleted.html(APP.labels.clear + "(" + _itemsCompleted + ")");
				_clearCompleted.show();
			}
			_itemsLeft = param.data.todos.length - _itemsCompleted;
			if (param.data.todos.length == 0) {
				_toggleAll.hide();
			} else {
				_toggleAll.show();
				if (_itemsLeft == 0) {
					_toggleAll.attr("checked", "checked");
				} else {
					_toggleAll.removeAttr("checked");
				}
			}
			_todoCounter.html("<strong>" + _itemsLeft + "</strong>&nbsp;" + (_itemsLeft == 1 ? APP.labels.itemLeft : APP.labels.itemsLeft));
		},
		mask: function (param) {
			param.msg = param.msg || "please wait...";
			var _mask = $("<div class='ui-mask'><div style='position:relative;top: 50%;left: 50%;color:yellow'>" + param.msg + "</div></div>"),
			_pos = param.renderTo.position();

			_mask.css("width", param.renderTo.width())
				.css("height", param.renderTo.height())
				.css("left", _pos.left)
				.css("top", _pos.top);

			$("body").append(_mask);
			return {
				hide: function () {
					_mask.hide();
					_mask.remove();
				}
			}
		}
	}
})();