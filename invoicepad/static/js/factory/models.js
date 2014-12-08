define(['app', 'jquery'], function(app, $) {
	app.factory('Models', function($q, $http) {
		return function Models(name, fields) {
			/**
			 * Represents a collection of models from the server.
			 *
			 * @constructor
			 * @this {Models}
			 * @param {string} name Used to build the url in the form of
			 *   http://domain/name/.
			 * @param {string[]} fields Attributes that can be saved back to
			 *   the server.
			 */
			
			this._name = name;
			this._fields = fields || [];

			this.models = {};

			this._apply = function(model) {
				/**
				 * Update model with the attributes from parameter. ISO time
				 * and date strings get parsed to Date objects.
				 *
				 * @this {Models}
				 * @param {object} model Object containing new properties.
				 */
				
				if (!(model.id in this.models))
					this.models[model.id] = {};

				var item = this.models[model.id];

				// Parse dates
				item._dates = [];
				item._times = [];
				for (attr in model) {
					if (typeof model[attr] === 'string') {
						// See if attribute can be parsed as date
						var date = Date.parse(model[attr]);
						if (!isNaN(date)) {
							// Remember dates and times separately to
							// accordingly serialize them on save
							if (model[attr].length == 10)
								item._dates = attr;
							else
								item._times = attr;
							// Overwrite attribute with Date object
							model[attr] = date;
						}
					}
				}

				// Add attributes to self and keep copy find changes later,
				// Deep copy needed since otherwise initial attributes would be
				// changed, too
				item._initial = $.extend(true, {}, model);
				$.extend(true, item, model);
			};

			this.load = function() {
				/**
				 * Fetch state from server and apply it.
				 *
				 * @this {Models}
				 * @returns {promise} Whether data could be fetched.
				 */

				// Fetch models from server
				var url = '/' + this._name + '/';
				var deferred = $http.get(url);

				var self = this;
				return $q(function(resolve, reject) {
					deferred.success(function(models) {
						// Apply new attributes
						for (model in models)
							self._apply(models[model]);
						resolve.apply(null, arguments);
					}).error(reject);
				});
			};

			this._changes = function(id) {
				/**
				 * Get differences between current and last fetched state of a
				 * model in the collection.
				 *
				 * @this {Models}
				 * @param {number} id What model to operate on.
				 * @returns {object} Contains just the modified properties.
				 */
				
				var item = this.models[id];

				// Find attributes that have changed
				var values = {};
				var self = this;
				this._fields.map(function(field) {
					if (field in item && field in item._initial)
						if (item[field] != item._initial[field])
							values[field] = item[field];
				});
				return values;
			};

			this.changed = function() {
				/**
				 * Check whether there are differenced between current and last
				 * fetched state of any model in the collection.
				 *
				 * @this {Models}
				 * @returns {boolean} Whether there are differences.
				 */
				for (id in this.models)
					if (Object.keys(this.models[id]._changes(id)).length)
						return true;
				return false;
			}

			this.create = function() {
				/**
				 * Add a new model to this collection. The created model will
				 * get passed to the promise resolve function.
				 *
				 * @this {Models}
				 * @returns {promise} Whether model could be created.
				 */

				// Send request to server
				var deferred = $.ajax({
					dataType: 'json',
					method: 'POST',
					url: '/' + this._name + '/',
				});

				var self = this;
				return $q(function(resolve, reject) {
					deferred.done(function(model) {
						// Sync back validated model
						self._apply(model);
						resolve.apply(null, arguments);
					}).error(reject);
				});
			}

			this.save = function(id) {
				/**
				 * Save current state of a model to the server.
				 *
				 * @this {Models}
				 * @throws {string} If there are no changes to store.
				 * @param {number} id What model to operate on.
				 * @returns {promise} Whether data could be stored.
				 */

				var item = this.models[id];

				// Notify if no changes were made
				var content = item._changes();
				if (!Object.keys(content).length)
					throw 'No changes';

				// Serialize time values
				for (time in item._dates)
					if (time in content && content[time])
						content[time] = content[time].toISOString().slice(0, 10);
				for (time in item._times)
					if (time in content && content[time])
						content[time] = content[time].toISOString();

				// Send request to server
				var deferred = $.ajax({
					dataType: 'json',
					method: 'PUT',
					url: '/' + this._name + '/' + id + '/',
					data: JSON.stringify(content),
				});

				var self = this;
				return $q(function(resolve, reject) {
					deferred.done(function(model) {
						// Sync back validated model
						self._apply(model);
						resolve.apply(null, arguments);
					}).error(reject);
				});
			};

			this.delete = function(id) {
				/**
				 * Delete model on the server and empty model on client side.
				 *
				 * @this {Models}
				 * @returns {promise} Whether model could be deleted.
				 */

				// Send request to server
				var deferred = $.ajax({
					method: 'DELETE',
					url: '/' + this._name + '/' + id + '/',
				});

				var self = this;
				return $q(function(resolve, reject) {
					deferred.done(function() {
						// Empty model
						delete self.items[id];
						resolve.apply(null, arguments);
					}).error(reject);
				});
			};
		};
	});
});
