angular.module("app", ["ngPasteFrom"])
	.controller "MainController", ($scope, ngPasteFromErrors) ->
		$scope.errors = []
		$scope.users = []

		$scope.onPaste = (data) ->
			$scope.errors = []
			data

		$scope.onError = (error, index) ->
			if error is ngPasteFromErrors.invalidColumnLength
				$scope.errors.push "Invalid column length on row " + (index + 1)

		$scope.onValidate = (object, index) ->
			if object.name.length == 0
				$scope.errors.push "Name must be 1 char or longer on row: " + (index + 1)
				return false

			if object.email.indexOf("@") == -1
				$scope.errors.push "Email is invalid format on row: " + (index + 1)
				return false

			return true

