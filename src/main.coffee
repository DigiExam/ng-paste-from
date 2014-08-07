angular.module("app", ["ngPasteFrom"])
	.controller "MainController", ($scope, ngPasteFromErrors) ->
		$scope.errors = []
		$scope.users = []

		$scope.beforeParse = (data) ->
			$scope.errors = []
			data

		$scope.onError = (error, rowData) ->
			if error is ngPasteFromErrors.invalidColumnLength
				expectedColumns = "#{rowData.expectedLength} column#{if rowData.expectedLength > 1 then 's' else ''}"
				$scope.errors.push "Line #{rowData.index + 1} should have #{expectedColumns}, but it had #{rowData.actualLength}: #{rowData.source}"

		$scope.onValidate = (row, rowData) ->
			errors = []
			isArray = row instanceof Array
			name = if isArray then row[0] else row.name
			email = if isArray then row[1] else row.email

			if name.length == 0
				errors.push "Name on line #{rowData.index + 1} must be 1 character or longer."
			if email.indexOf("@") == -1
				errors.push "E-mail on line #{rowData.index + 1} is not valid: #{rowData.source}"

			[].push.apply $scope.errors, errors

			!errors.length

