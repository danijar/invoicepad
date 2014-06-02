define(['jquery', 'underscore', 'text!template/index.html'], function($, _, Template) {

	// Private members
	var el;
	var template;

	function initialize() {
		// Add container
		el = $('<article class="index">');
		
		// Compile template
		template = _.template(Template);
	}

	function render() {
		// Set content from template
		$('.content').html(el);
		el.html(template({}));
	}

	function main() {
		initialize();

		// Return public functions
		return {
			render: render,
		};
	}

	return main;
});
