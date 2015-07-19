///<reference path='../../typings/tsd.d.ts'/>
(function () {
	'use strict';
	var app = angular.module('MainApp');

	app.factory('EmployeeService', ['$q', EmployeeService]);
	function EmployeeService($q) {
		var _db;
		var _employees;
		function getEmployees() {
			if (!_employees) {
				return $q.when(_db.allDocs({ include_docs: true }))
					.then(function (docs) {
						_employees = docs.rows.map(function (row) {
							return row.doc;
						});
						// Listen for changes on the database.
						_db.changes({ live: true, since: 'now', include_docs: true })
							.on('change', onDatabaseChange);
						return _employees;
					});
			} else {
				// Return cached data as a promise
				return $q.when(_employees);
			}
		};
		function onDatabaseChange(change) {
			var index = findIndex(_employees, change.id);
			var birthday = _employees[index];

			if (change.deleted) {
				if (birthday) {
					_employees.splice(index, 1); // delete
				}
			} else {
				if (birthday && birthday._id === change.id) {
					_employees[index] = change.doc; // update
				} else {
					_employees.splice(index, 0, change.doc) // insert
				}
			}
		}
		// Binary search, the array is by default sorted by _id.
		function findIndex(array, id) {
			var low = 0, high = array.length, mid;
			while (low < high) {
				mid = (low + high) >>> 1;
				array[mid]._id < id ? low = mid + 1 : high = mid
			}
			return low;
		}
		//Add a birthday
		
		function addEmployee(_employees) {
			console.log('adding');
			return $q.when(_db.post(_employees));
		}
		function initDb() {
			
			_db = new PouchDB('employees', { adaptor: 'websql' });
			console.log('created');
		}

		function deleteEmployee(employee) {
			return $q.when(_db.remove(employee));
		}


		return {
			getEmployees: getEmployees,
			addEmployee: addEmployee,
			deleteEmployee: deleteEmployee,
			//getByEmployeeId: getByEmployeeId,
			initDB: initDb
		}


	}

})();