define(['app', 'jquery'], function(app, $) {
	app.directive('current', ['$location', function($location) {
		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				// Listen to route changes
				$scope.location = $location;
				$scope.$watch('location.path()', function(route) {
					$element.children().each(function() {
						// Get link destination
						var href = $(this).attr('href');

						// Extract hash
						if (href && href.indexOf('#') > -1) {
							var hash = href.split('#')[1];

							// Current item has class
							if (hash == route)
								$(this).addClass('current');
							else
								$(this).removeClass('current');
						}
					});
				});
			}
		};
	}]);
});
