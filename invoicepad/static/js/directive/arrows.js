define(['app', 'jquery'], function(app, $) {
	app.directive('arrows', function() {
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {
				element.on('keydown', function(e) {
					
					var rows = element.children();
					var current = rows.filter('.selected');
					var next = current;

					console.log(e.keyCode);

					if (current.length) {
						// Arrow down
						if (e.keyCode == 40) {
							if (current != rows.last())
								next = current.next();
						}
						// Arrow up
						else if (e.keyCode == 38) {
							if (current != rows.first())
								next = current.prev();
						}
					} else {
						next = rows.first();
					}

					current.removeClass('selected');
					next.addClass('selected');

					// Prevent scrolling
					return false;
				});
			},
		};
	});
});
