define(['jquery'], function($) {

	function message(el, text, type) {
        // Fallback to success type
        type = type || 'success';

		// Blend and remove old ones
		el.find('.message').slideUp(200, function() {
			$(this).remove();
		});

		// Wait for remove animation
		setTimeout(function() {
			// Add if valid text
			if (text) {
				// Create message
				var message = $('<p class="message ' + type + '">');
				message.html(text);

				// Blend in
				message.hide();
				el.append(message);
				message.slideDown(200);
			}
		}, 100);
	}

	return message;
});
