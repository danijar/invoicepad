define(['jquery', 'underscore', 'helper/message', 'text!template/console.html', 'css!style/console.css'], function($, _, Message, Template) {

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
		el = $('<article class="console">');
		
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

	function send(e) {
		// Read inputs
		var method  = el.find('#method').val();
		var url     = el.find('#url').val();
		var content = el.find('#content').val();

		// Send AJAX request
		var deferred = $.ajax({
			dataType: 'json',
			method: method,
			url: url,
			data: content,
		});

		// Write output
		deferred.done(function(e) {
			var result = JSON.stringify(e, null, 4);
			Message(el, '<pre>' + result + '</pre>', 'success');
		}).fail(function(e) {
            var result = JSON.stringify(e, null, 4);
            Message(el, '<pre>' + result + '</pre>', 'error');
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
		render();
	}

	return main;
});
