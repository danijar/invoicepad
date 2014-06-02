define(['jquery', 'underscore', 'text!template/test.html', 'css!style/test.css'], function($, _, Template) {

	// Private members
	var el;
	var template;
	var presets = [
		{ name: 'Get all customers',        method: 'GET',    url: '/customer/',    content: '' },
		{ name: 'Get single customer',      method: 'GET',    url: '/customer/42/', content: '' },
		{ name: 'Create new customer',      method: 'POST',   url: '/customer/',    content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
		{ name: 'Update existing customer', method: 'PUT',    url: '/customer/42/', content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
		{ name: 'Delete existing customer', method: 'DELETE', url: '/customer/42/', content: '' },
	];

	function initialize() {
		// Add container
		el = $('<article class="test">');
		
		// Compile template
		template = _.template(Template);
	}

	function render() {
		// Set content from template
		$('.content').html(el);
		el.html(template({}));

		// Fill presets list
		var select = el.find('#presets');
		for (var i = 0; i < presets.length; ++i)
			select.append('<option value="' + i + '">' + presets[i].name + '</option>');

		// Select first preset
		preset();

		// Events
		el.find('#presets').change(preset);
		el.find('.send').click(send);
	}

	function message(text) {
		// Blend and remove old ones
		el.find('.message').slideUp(200, function() {
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
				el.append(message);
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
		var selection = el.find('#presets option:selected').val();
		var values = presets[selection];

		// Apply to fields
		el.find('#method').val(values.method);
		el.find('#url').val(values.url);
		el.find('#content').val(values.content);
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
