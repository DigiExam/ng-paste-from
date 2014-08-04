ngPasteFrom = angular.module "ngPasteFrom", []

ngPasteFrom.directive "ngPasteFrom", ->
	restrict: "E"
	replace: true
	template: '<p>I like turtles</p>'
	scope: {
		time: "="
		disabled: "="
	}
	
	link: ($scope, element, attrs)->
		$scope.minutes 	= [0..59]
		$scope.hours 	= [0..23]

	controller: ($scope, $filter) ->
		$scope.hour 	= "00"
		$scope.minute 	= "00"

		if $scope.time?
			split 			= $scope.time.split(":")
			$scope.hour 	= split[0]
			$scope.minute 	= split[1]

		$scope.updateScope = ->
			

		$scope.$watch "hour", $scope.updateScope
		$scope.$watch "minute", $scope.updateScope