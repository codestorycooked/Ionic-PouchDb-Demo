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
		//Add a birthday
		function addEmployee(birthday) {
			return $q.when(_db.post(birthday));
		}
		function initDb() {
			_db = new PouchDB('employees', { adaptor: 'websql' });
		}


		return {
			getEmployees: getEmployees,
			addEmployee: addEmployee,
			deleteEmployee: deleteEmployee,
			getByEmployeeId: getByEmployeeId,
			initDb: initDb
		}


	}

})();