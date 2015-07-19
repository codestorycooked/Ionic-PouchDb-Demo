///<reference path='../../typings/tsd.d.ts'/>
(function(){
	'use strict';
	var app=angular.module('MainApp');
	app.controller('EmployeeController',['$scope','$ionicPlatform','EmployeeService',EmployeeController]);
	function EmployeeController($scope,$ionicPlatform,EmployeeService){
		var vm=this;
		//$scope.employee=[];
		$ionicPlatform.ready(function(){
			EmployeeService.initDB();
			EmployeeService.getEmployees().then(function(employees){
				vm.employees=employees;
			})
		})
		
		
		vm.AddEmployee=function(employee){
			//alert('kunal');
			console.log(employee);
			EmployeeService.addEmployee(employee).then(function(success){
				console.log(success);
			},function(error){
				console.log(error);
			});
		}
		vm.Delete=function(employee){
			EmployeeService.deleteEmployee(employee).then(function(success){
				console.log(success);
			})
		};
		return vm;
	}
})();