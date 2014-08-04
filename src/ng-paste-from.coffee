ngPasteFrom = angular.module "ngPasteFrom", []

ngPasteFrom
	.constant "ngPasteFromErrors", 
		invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH"
		failedValidation: "NGPASTEFROM_FAILED_VALIDATION"
	.directive "ngPasteFrom", ->
		restrict: "A"
		scope: 
			ngPasteFrom: "="
			ngPasteFromFormat: "="
			ngPasteFromOnValidate: "="
			ngPasteFromOnError: "="
		
		link: ($scope, element, attrs) ->
			if not $scope.ngPasteFromFormat?
				console.error "Missing required attribute ngPasteFromFormat."

			# NOTE: This solution with paste + keyup kind of works, but it is not optimal.
			# It causes the data to show and not get processed until key up.
			element.on "paste", (event) ->
				element.val("")
				$scope.hasPasted = true
			
			element.on "keyup", (event) ->
				if $scope.hasPasted
					$scope.$apply ->
						$scope.pasteData = element.val()
					
					$scope.hasPasted = false

				element.val("")
			
		controller: ($scope, $filter, ngPasteFromErrors) ->
			defaultOnError = (error, index) ->
				console.error "ngPasteFromError: index " + index + " error: " + error

			defaultOnValidate = (object, index) ->
				return true

			# Assign default error and validation handler in case they are not set.
			if not $scope.ngPasteFromOnError? then $scope.ngPasteFromOnError = defaultOnError
			if not $scope.ngPasteFromOnValidate? then $scope.ngPasteFromOnValidate = defaultOnValidate

			splitToRows = (data) ->
				lineEndingsRegExp = /\r\n|\n\r|\n|\r/g;
				lineEnding = "\n"

				return data.replace(lineEndingsRegExp, lineEnding).split(lineEnding)

			splitToColumns = (row) ->
				separatorChar = "\t"

				return row.split(separatorChar)

			columnsToObject = (columns) ->
				o = {}
				format = $scope.ngPasteFromFormat

				for c, i in columns
					o[format[i]] = c

				return o

			$scope.processPasteData = (data) ->
				rows = splitToRows data
				result = []

				for r, i in rows
					columns = splitToColumns r

					if columns.length isnt $scope.ngPasteFromFormat.length
						$scope.ngPasteFromOnError ngPasteFromErrors.invalidColumnLength, i
						continue

					o = columnsToObject columns

					if $scope.ngPasteFromOnValidate o, i
						result.push o
					else
						$scope.ngPasteFromOnError ngPasteFromErrors.failedValidation, i

				$scope.ngPasteFrom = result

			$scope.$watch "pasteData", ->
				if $scope.pasteData? and 0 < $scope.pasteData.length
					$scope.processPasteData($scope.pasteData)
					$scope.pasteData = null