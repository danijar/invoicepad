define(['app', 'jquery', 'underscore'], function(app, $, _) {
	app.factory('Model', function($q, $http) {
		return function Model(name, id, fields) {
			/**
			 * Represents a model from the server.
			 *
			 * @constructor
			 * @this {Model}
			 * @param {string} name Used to build the url in the form of
			 *   http://domain/name/id/.
			 * @param {number} id Database index of the represented instance on
			 *   the server.
			 * @param {string[]} fields Attributes that can be saved back to
			 *   the server.
			 */
			
			this._name = name;
			this._id = id;
			this._fields = fields;
			this._initial = {};
			this._dates = [];
			this._times = [];

			this._apply = function(model) {
				/**
				 * Update model with the attributes from parameter. ISO time
				 * and date strings get parsed to Date objects.
				 *
				 * @this {Model}
				 * @param {object} model Object containing new properties.
				 */
				
				// Warn about and drop attributes matching internal names
				var reserved = ['load', 'changed', 'save', 'delete'];
				for (attr in model) {
					if (attr.length && attr.charAt(0) == '_') {
						console.error('Attribute ' + attr + ' of backend model '
							+ 'starts with an underscore which is reserved for '
							+ 'internal functions and attributes.');
						delete model[attr];
					}
					for (other in reserved) {
						if (attr == other) {
							console.error('Attribute ' + attr + ' of backend '
								+ 'model conflicts with build in function.');
							delete model[attr];
						}
					}
				}

				// Parse dates
				this._dates = [];
				this._times = [];
				for (attr in model) {
					if (typeof model[attr] === 'string') {
						// See if attribute can be parsed as date
						var date = Date.parse(model[attr]);
						if (!isNaN(date)) {
							// Remember dates and times separately to
							// accordingly serialize them on save
							if (model[attr].length == 10)
								this._dates = attr;
							else
								this._times = attr;
							// Overwrite attribute with Date object
							model[attr] = date;
						}
					}
				}

				// Add attributes to self and keep copy find changes later,
				// Deep copy needed since otherwise initial attributes would be
				// changed, too
				this._initial = $.extend(true, {}, model);
				$.extend(true, this, model);
			};

			this.load = function() {
				/**
				 * Fetch state from server and apply it.
				 *
				 * @this {Model}
				 * @returns {promise} Whether data could be fetched.
				 */

				// Fetch model from server
				var url = '/' + this._name + '/' + this._id + '/';
				var deferred = $http.get(url);

				var self = this;
				return $q(function(resolve, reject) {
					deferred.success(function(model) {
						// Apply new attributes
						self._apply(model);
						resolve(arguments);
					}).error(reject);
				});
			};

			this._changes = function() {
				/**
				 * Get differences between current and last fetched state.
				 *
				 * @this {Model}
				 * @returns {object} Contains just the modified properties.
				 */

				// Find attributes that have changed
				var values = {};
				var self = this;
				this._fields.map(function(field) {
					if (field in self && field in self._initial)
						if (self[field] != self._initial[field])
							values[field] = self[field];
				});
				return values;
			};

			this.changed = function() {
				/**
				 * Check whether there are differenced between current and last
				 * fetched state.
				 *
				 * @this {Model}
				 * @returns {boolean} Whether there are differences.
				 */
				return Boolean(Object.keys(this._changes()).length);
			}

			this.save = function() {
				/**
				 * Save current state to the server.
				 *
				 * @this {Model}
				 * @throws {string} If there are no changes to store.
				 * @returns {promise} Whether data could be stored.
				 */

				// Notify if no changes were made
				var content = this._changes();
				if (!Object.keys(content).length)
					throw 'No changes';

				// Serialize time values
				for (time in this._dates)
					if (time in content && content[time])
						content[time] = content[time].toISOString().slice(0, 10);
				for (time in this._times)
					if (time in content && content[time])
						content[time] = content[time].toISOString();

				// Send request to server
				var deferred = $.ajax({
					dataType: 'json',
					method: 'PUT',
					url: '/' + this._name + '/' + this._id + '/',
					data: JSON.stringify(content),
				});

				var self = this;
				return $q(function(resolve, reject) {
					deferred.done(function(model) {
						// Sync back validated model
						self._apply(model);
						resolve(arguments);
					}).error(reject);
				});
			};

			this.delete = function() {
				/**
				 * Delete model on the server and empty model on client side.
				 *
				 * @this {Model}
				 * @returns {promise} Whether model could be deleted.
				 */

				// Send request to server
				var deferred = $.ajax({
					method: 'DELETE',
					url: '/' + this._name + '/' + this._id + '/',
				});

				var self = this;
				return $q(function(resolve, reject) {
					deferred.done(function(model) {
						// Empty model
						self._apply({});
						resolve(arguments);
					}).error(reject);
				});
			};
		};
	});
});
