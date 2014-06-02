define(['jquery', 'underscore', 'text!template/customers.html', 'css!style/customers.css'], function($, _, Template) {

	// Private members
	var el;
	var template;

	function initialize() {
		// Add container
		el = $('<article class="customers">');
		
		// Compile template
		template = _.template(Template);
	}

	function render() {
		// Fetch models from database
		var deferred = $.ajax({
			dataType: 'json',
			method: 'GET',
			url: '/customer/',
		});

		// Write output
		deferred.done(function(models) {
			// Set content from template
			$('.content').html(el);
			el.html(template({ models: models }));

			// Relax table colums
			relax();
		}).error(console.error);
	}

	function relax() {
		// Find maximum with of each cell
		var widths = [];
		el.find('ul').children().each(function() {
			// Iterate of each cell in current row
			$(this).children().each(function(index) {
				// Guarantee index bounds
				while (index > widths.length - 1)
					widths.push(0);

				// Update width if larger
				var width = $(this).width();
				if (widths[index] < width)
					widths[index] = width;
			});
		});

		// Relax table colums
		el.find('ul').children().each(function() {
			$(this).children().each(function(index) {
				// Set cell with to maximum
				$(this).width(widths[index]);
			});
		});
	}

	function main() {
		initialize();
		render();
	}

	return main;
});
