define(['jquery', 'underscore', 'helper/message', 'text!template/customer.html', 'css!style/customer.css'], function($, _, Message, Template) {

	// Private members
	var el;
	var template;
    var id;

	function initialize(customer) {
        // Store customer id
        id = customer;

		// Add container
		el = $('<article class="customer">');
		
		// Compile template
		template = _.template(Template);

        // Register events
        el.on('click', '.save', save);
	}

	function render() {
		// Fetch models from server
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

    function save() {
        // List of field ids
        var fields = ['name', 'fullname', 'mail', 'website', 'address1', 'address2', 'address3', 'notes', 'logo'];

        // Read field values into a map
        var data = {};
        fields.map(function(field) {
            var value = el.find('#' + field).val().trim();
            if (value.length)
                data[field] = value;
        });

        // Send to server
        var deferred = $.ajax({
            dataType: 'json',
            method: 'PUT',
            url: '/customer/' + id + '/',
            data: JSON.stringify(data),
        });

        // Write output
        deferred.done(function(e) {
            Message(el, 'All changes saved.', 'success');
            scroll();
            update(e);
        }).fail(function(e) {
            Message(el, 'An error occurred.', 'error');
            scroll();
            console.log(e);
        });

        // Don't follow link
        return false;
    }

    function update(data) {
        console.log(data);
        if (data.logo) {
            el.find('#logo').val('');
            el.find('.logo').css('background-image', 'url(' + data.logo + ')');
        }
    }

    function scroll() {
        setTimeout(function() {
            $('html, body').animate({ scrollTop: $(document).height() }, 200);
        }, 100);
    }

	function main(id) {
        initialize(id);
		render();
	}

	return main;
});
