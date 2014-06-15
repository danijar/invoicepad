define(['app', 'jquery'], function(app, $) {
	app.directive('relax', function() {
		return {
			restrict: 'A',
			link: function($scope, element, attrs) {
				// Wait for nested directives to complete, e.g. ng-repeat
				var watch = $scope.$watch(function() {
					return element.children().length;
				}, function() {
					$scope.$evalAsync(function() {
						// Remove forced widths
						$(element).children().children().css('width', '');

						// Find maximum with of each cell
						var widths = [];
						$(element).children().each(function() {
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
						$(element).children().each(function() {
							$(this).children().each(function(index) {
								// Set cell with to maximum
								$(this).width(widths[index]);
							});
						});
					});
				});
			},
		};
	});
});
