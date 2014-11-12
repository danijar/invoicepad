define(['jquery', 'underscore', 'app', 'helper/message', 'css!style/project.css'], function($, _, app, Message) {
	app.controller('project', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
		// Fetch model id from route
		var id = $routeParams.id;

		function load() {
			// Fetch model from server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'GET',
				url: '/project/' + id + '/',
			});

			// Inject into scope
			deferred.done(function(model) {
				$scope.$apply(function() {
					// Parse dates
					if ('deadline' in model && model.deadline)
						model.deadline = new Date(model.deadline);
					if ('agreement' in model && model.agreement)
						model.agreement = new Date(model.agreement);
					if ('finished' in model && model.finished)
						model.finished = new Date(model.finished);

					$scope.model = model;
					// Keep copy to compare changes
					$scope.initial = $.extend({}, model);

					// Initialize finished checkbox
					$scope.model.has_finished = !!('finished' in model && model.finished);
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});

			// Fetch times from server
			$.ajax({
				dataType: 'json',
				method: 'GET',
				url: '/project/' + id + '/time/',
			}).done(function(times) {
				$scope.$apply(function() {
					// Convert to dictionary with id as key
					$scope.times = {};
					$scope.initial_times = {};
					_.each(times, function(time) {
						// Parse dates
						if ('start' in time && time.start)
							time.start = new Date(time.start);
						if ('end' in time && time.end)
							time.end = new Date(time.end);
						$scope.times[time.id] = time;
						$scope.initial_times[time.id] = $.extend({}, time);
					});
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		function changes() {
			// List of field ids
			var fields = ['name', 'description', 'deadline', 'agreement', 'finished', 'value', 'hours'];

			// Read field values into a map
			var values = {};
			fields.map(function(field) {
				if (field in $scope.model) {
					// Filter changes
					var value = $scope.model[field];
					var changed = true;
					if (field in $scope.initial)
						changed = (value != $scope.initial[field]);
					if (changed)
						values[field] = value;
				}
			});

			return values;
		}

		function changes_time(id) {
			if (!(id in $scope.times))
				throw 'Time with this id does not exist.';

			// List of field ids
			var fields = ['message', 'start', 'end'];

			// Read field values into a map
			var values = {};
			fields.map(function(field) {
				if (field in $scope.times[id]) {
					// Filter changes
					var value = $scope.times[id][field];
					var changed = true;
					if (field in $scope.initial_times[id])
						changed = (value != $scope.initial_times[id][field]);
					if (changed)
						values[field] = value;
				}
			});

			return values;
		}

		$scope.save = function() {
			// Remove finished date if unchecked
			if (!$scope.model.has_finished)
				$scope.model.finished = null;

			// Get changes
			var content = changes();

			// Skip if no changes were made
			if (!Object.keys(content).length) {
				$scope.message = 'You did not make any changes.';
				return;
			}

			// Serialize dates
			if ('deadline' in content && content.deadline)
				content.deadline = content.deadline.toISOString().slice(0, 10);
			if ('agreement' in content && content.agreement)
				content.agreement = content.agreement.toISOString().slice(0, 10);
			if ('finished' in content && content.finished)
				content.finished = content.finished.toISOString().slice(0, 10);

			// Send request to server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'PUT',
				url: '/project/' + id + '/',
				data: JSON.stringify(content),
			});

			// Sync back validated model
			deferred.done(function(model) {
				$scope.$apply(function() {
					// Parse dates
					if ('deadline' in model && model.deadline)
						model.deadline = new Date(model.deadline);
					if ('agreement' in model && model.agreement)
						model.agreement = new Date(model.agreement);
					if ('finished' in model && model.finished)
						model.finished = new Date(model.finished);

					$scope.model = model;
					$scope.message = 'All changes saved.';
					$location.path('/project');
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		};

		$scope.save_time = function(id) {
			// Get changes
			var content = changes_time(id);

			// Skip if no changes were made
			if (!Object.keys(content).length) {
				console.log('Left field without changes.');
				return;
			}

			// Send request to server
			$.ajax({
				dataType: 'json',
				method: 'PUT',
				url: '/time/' + id + '/',
				data: JSON.stringify(content),
			}).done(function(time) {
				$scope.$apply(function() {
					// Parse dates
					if ('start' in time && time.start)
						time.start = new Date(time.start);
					if ('end' in time && time.end)
						time.end = new Date(time.end);
					// Add to scope
					$scope.times[time.id] = time;
					$scope.initial_times[time.id] = $.extend({}, time);
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		$scope.end_time = function(id) {
			$scope.times[id].end = new Date();
			$scope.save_time(id);
		}

		$scope.delete = function() {
			// Ask user to confirm
			if (!confirm("Please confirm to delete project '" + $scope.model.name + "' permanently."))
				return;

			// Send request to server
			var deferred = $.ajax({
				method: 'DELETE',
				url: '/project/' + id + '/',
			});

			// Sync back validated model
			deferred.done(function() {
				$scope.$apply(function() {
					$scope.message = 'This project was deleted.';
					$location.path('/project');
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		};

		$scope.abort = function() {
			// Find out if changes were made
			var changed = Object.keys(changes()).length ? true : false;

			// Ask user to confirm if there are changes
			if (!changed || confirm('Unsaved changes will be discarded.'))
				$location.path('/project');
		}

		$scope.create_time = function() {
			var content = { project: id };

			// Send request to server
			$.ajax({
				dataType: 'json',
				method: 'POST',
				url: '/time/',
				data: JSON.stringify(content),
			}).done(function(time) {
				$scope.$apply(function() {
					// Add to scope
					$scope.times[time.id] = time;
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		// Template helpers
		$scope.dict_length = function(dict) {
			if (typeof dict === 'object')
				return Object.keys(dict).length;
		}

		$scope.distance = function(from, to) {
			if (!from)
				return 0;
			to = to || new Date();
			return Math.round((to.getTime() - from.getTime()) / (1000 * 60));
		}

		// Sum of all times in hours
		$scope.total = 0;
		$scope.$watchCollection('times', function() {
			if (!$scope.times)
				return;
			var sum = 0;
			_.each($scope.times, function(time) {
				sum += $scope.distance(time.start, time.end);
			});
			sum = Math.round(sum / 60);
			$scope.total = sum;
		});

		$scope.random = function() {
			// Generate title case words
			var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
			words = words.replace(/[^A-Za-z ]/g, '').split(' ').map(titleCase);

			// Helper functions
			function pick(number) { return 1 + parseInt(Math.random() * number) % number; }
			function titleCase(word) { return word[0].toUpperCase() + word.substr(1); }
			function sentence() { var text = _.sample(words); var length = 5 + pick(10); for (var i = 0; i < length; ++i) text += ' ' + _.sample(words).toLowerCase(); return text + '.'; }
			function text() { var text = sentence(); var length = 5 + pick(10); for (var i = 0; i < length; ++i) text += ' ' + sentence(); return text; }
			function offset(date, offset) { var result = new Date(date); result.setMonth(result.getMonth() + offset); return result; }
			function date(past, future) { return new Date(past.getTime() + Math.random() * (future.getTime() - past.getTime())); }

			// Generate random model data
			$scope.model.name = _.sample(words, 1 + pick(1)).join(' ');
			$scope.model.agreement = date(offset(new Date(), -3), new Date());
			$scope.model.deadline = date(offset($scope.model.agreement, 1), offset(new Date(), 3));
			if (Math.random() > .5) { $scope.model.finished = date(offset($scope.model.agreement, 1), new Date()); $scope.model.has_finished = true; }
			else { $scope.model.finished = null; $scope.model.has_finished = false; }
			$scope.model.description = text();
		};

		load();
	}]);
});
