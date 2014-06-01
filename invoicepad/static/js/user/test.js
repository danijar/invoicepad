define(['jquery', 'underscore', 'text!template/test.html', 'css!style/test.css'], function($, _, Template) {

	// Private members
	var element;
	var template;
	var presets = [
		{ name: 'Get all customers', method: 'GET', url: '/customer/', content: '' },
		{ name: 'Get single customer', method: 'GET', url: '/customer/42/', content: '' },
		{ name: 'Create new customer', method: 'POST', url: '/customer/', content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
		{ name: 'Update existing customer', method: 'PUT', url: '/customer/42/', content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
		{ name: 'Delete existing customer', method: 'DELETE', url: '/customer/42/', content: '' },
	];

	function initialize() {
		// Create main container
		element = $('<section class="test">');
		$('article').first().append(element);

		// Compile template
		template = _.template(Template);

		// Events
		$(document).on('change', '.test #presets', preset);
		$(document).on('click', '.test .send', send);
	}

	function render() {
		// Trigger redraw to fix boxshadow
		element.parent().css('transform', 'scale(1)');

		// Set content from template
		element.html(template({}));

		// Fill presets list
		var select = $('.test #presets');
		for (var i = 0; i < presets.length; ++i)
			select.append('<option value="' + i + '">' + presets[i].name + '</option>');

		// Select first preset
		preset();
	}

	function message(text) {
		// Blend and remove old ones
		element.find('.message').slideUp(200, function() {
			$(this).remove();
		});

		// Wait for remove animation
		setTimeout(function() {
			// Add if valid text
			if (text) {
				// Create message
				var message = $('<p class="message">');
				message.html(text);

				// Blend in
				message.hide();
				element.append(message);
				message.slideDown(200);
			}
		}, 100);
	}

	function send(e) {
		// Read inputs
		var method = $('.test #method').val();
		var url = $('.test #url').val();
		var content = $('.test #content').val();

		// Send AJAX request
		var deferred = $.ajax({
			dataType: 'json',
			method: method,
			url: url,
			data: content,
		});

		// Write output
		deferred.always(function(e) {
			var result = JSON.stringify(e, null, 4);
			message('<pre>' + result + '</pre>');
		});

		// Don't follow link
		return false;
	}

	function preset () {
		// Read input
		var selection = $('.test #presets option:selected').val();
		var values = presets[selection];

		// Apply to fields
		$('.test #method').val(values.method);
		$('.test #url').val(values.url);
		$('.test #content').val(values.content);
	}

	function main() {
		initialize();
		render();
	}

	return main;
});
