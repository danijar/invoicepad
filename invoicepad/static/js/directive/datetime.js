define(['app'], function(app) {
	app.directive('datetime', function() {
		// Add leading zeroes to the string of a number
		function pad(value, digits) {
			while (value.toString().length < digits)
				value = '0' + value;
			return value;
		}

		function link($scope, $element, $attrs, ngModelController) {
			ngModelController.$parsers.push(function(data) {
				// Skip non String types and empty strings
				// if (!(data instanceof String && data.length > 0))
				// 	return data;
				console.log('parse', data, typeof data);
				// Convert data from view format to model format
				return new Date(data);
			});
			ngModelController.$formatters.push(function(data) {
				// Convert strings to date objects
				if (typeof data === 'string' && data.length)
					data = new Date(data);
				// Skip other types
				if (!(data instanceof Date))
					return data;
				// Convert data from model format to view format
				var dd   = pad(data.getDate(), 2);
				var MM   = pad(data.getMonth() + 1, 2);
				var yyyy = pad(data.getFullYear(), 4);
				var H    = pad(data.getHours(), 2);
				var mm   = pad(data.getMinutes(), 2);
				return yyyy + '-' + MM + '-' + dd + ' ' + H + ':' + mm;
			});
		}

		// Return directive
		return {
			require: 'ngModel',
			link: link
		}
	});
});
