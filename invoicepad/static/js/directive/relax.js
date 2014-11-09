define(['app', 'jquery'], function(app, $) {
	app.directive('relax', function() {
		// Execute once per usage
		function link($scope, $element) {
			// Wait for nested directives to complete, e.g. ng-repeat
			var watch = $scope.$watch(function() {
				return $element.children().length;
			}, function() {
				$scope.$evalAsync(function() {
					// Remove forced widths
					$($element).children().children().css('width', '');

					// Find maximum with of each column
					var widths = [];
					$($element).children().each(function() {
						// Skip ignored rows
						if ($(this).hasClass('ignore'))
							return;
						// Iterate over each cell in current row
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
					$($element).children().each(function() {
						$(this).children().each(function(index) {
							// Set cell with to maximum
							$(this).width(widths[index]);
						});
					});
				});
			});
		};

		// Return directive
		return {
			restrict: 'A',
			link: link
		};
	});
});
