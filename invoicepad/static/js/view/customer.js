define(['jquery', 'underscore', 'text!template/customer.html', 'css!style/customer.css'], function($, _, Template) {

	// Private members
	var el;
	var template;

	function initialize() {
		// Add container
		el = $('<article class="customer">');
		
		// Compile template
		template = _.template(Template);
	}

	function render(id) {
		// Fetch models from database
		var deferred = $.ajax({
			dataType: 'json',
			method: 'GET',
			url: '/customer/' + id + '/',
		});

		// Write output
		deferred.done(function(model) {
			// Set content from template
			$('.content').html(el);
			el.html(template({ model: model }));
		}).error(console.error);
	}

	function main(id) {
		initialize();
		render(id);
	}

	return main;
});
