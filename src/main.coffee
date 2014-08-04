angular.module("app", ["ngPasteFrom"])
	.controller "MainController", ($scope) ->
		$scope.users = [
			{
				name: "Robin Andersson"
				email: "robin.andersson@digiexam.se"
			}
		]