define(['app', 'jquery'], function(app, $) {
	app.directive('arrows', function($parse) {
		// Function to select an item
		function focus(target) {
			// Set focus if given a single target
			if (target.length == 1) {
				if (!target.attr('tabindex'))
					target.attr('tabindex', 0);
				target.focus();

				// Prevent scrolling
				return false;
			}
		}

		// Resolve text based jQuery selector
		function select(element, query) {
		    // Variables
			var keywords = 'is find parent children first last next prev nextAll prevAll nextUntil prevUntil'.split(' ');
		    var debug = '$(this)';
		    var operation = '', filter = '';
		    
		    // Apply operation if available with filter as parameter
		    var flush = function() {
		        if (operation) {
		            // Apply operation
		            element = element[operation](filter || undefined);
		            debug += '.' + operation + '(' + (filter ? '\'' + filter + '\'' : '') + ')';
		            operation = '', filter = '';
		        } else if (filter) {
		             // Apply filter
		            element = element.filter(filter);
		            debug += '.filter(\'' + filter + '\')';
		            filter = '';
		        }   
		    }
		    
		    // For each token
			_.each(query.split(' '), function(token) {
		        if (_.contains(keywords, token)) {
		            // Apply last operation with last parameter
		            flush();       
		            operation = token;
		        } else {
		            // Collect current filter
		            filter += ' ' + token;
		        }
			});
		    
		    // Apply last operation without parameter
		    flush();
		    
		    debug += ';';
		    console.log(debug);
			return element;
		}

		// Execute once per usage
		function link($scope, $element, $attrs) {
			var values = $parse($attrs.arrows)($scope);

			// Listen to key events on focused element
			$element.on('keydown', values.on, function(e) {
				if (!$(this).is(':focus'))
					return;
				
				// Find next focus
				var target = $();
				if (e.which == 37 && values.left)
					target = select($(this), values.left);
				else if (e.which == 38 && values.up)
					target = select($(this), values.up);
				else if (e.which == 39 && values.right)
					target = select($(this), values.right);
				else if (e.which == 40 && values.down)
					target = select($(this), values.down); 
			
				// Follow link on enter
				else if (e.which == 13)
					$(this).find('a').first().click();

				// Focus and prevent event bubbling if found
				if (target.length) {
					focus(target.first());
					return false;
				}
			});

			// Step in at first element
			$element.on('focus', function(e) {
				focus($(this).find(values.on).first());
			});	

			// Focus item when hovered
			if (values.mouse)
				$element.on('mouseenter', values.on, function() {
					if ($element.find(':focus').length)
						focus($(this));
				});
		}

		// Return directive
		return {
			restrict: 'A',
			link: link
		};
	});
});
