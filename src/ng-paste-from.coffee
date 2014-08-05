angular.module "ngPasteFrom", []
	.constant "ngPasteFromErrors",
		invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH"
		failedValidation: "NGPASTEFROM_FAILED_VALIDATION"

	.directive "ngPasteFrom", ->
		restrict: "A"
		scope: 
			ngPasteFrom: "="
			ngPasteFromFormat: "="
			ngPasteFromOnPaste: "="
			ngPasteFromOnValidate: "="
			ngPasteFromOnError: "="

		link: ($scope, element, attrs) ->
			if not $scope.ngPasteFromFormat?
				console.error "Missing required attribute ngPasteFromFormat."

			# NOTE: This solution with paste + keyup kind of works, but it is not optimal.
			# It causes the data to show and not get processed until key up.
			element.on "paste", ->
				element.val ""
				$scope.hasPasted = true

			element.on "keyup", ->
				if $scope.hasPasted
					pasteData = element.val()
					if typeof $scope.ngPasteFromOnPaste is "function"
						pasteData = $scope.ngPasteFromOnPaste pasteData
					$scope.$apply ->
						$scope.pasteData = pasteData
					$scope.hasPasted = false
				element.val ""

		controller: ($scope, $filter, ngPasteFromErrors) ->
			splitToRows = (data) ->
				lineEndingsRegExp = /\r\n|\n\r|\n|\r/g;
				lineEnding = "\n"
				data.replace(lineEndingsRegExp, lineEnding).split(lineEnding)

			splitToColumns = (row) ->
				separatorChar = "\t"
				row.split separatorChar

			columnsToObject = (columns) ->
				obj = {}
				format = $scope.ngPasteFromFormat
				for column, index in columns
					obj[format[index]] = column
				obj

			$scope.processPasteData = (data) ->
				rows = splitToRows data
				result = []

				for row, index in rows
					columns = splitToColumns row

					if columns.length isnt $scope.ngPasteFromFormat.length
						if typeof $scope.ngPasteFromOnError is "function"
							$scope.ngPasteFromOnError ngPasteFromErrors.invalidColumnLength, index
						continue

					obj = columnsToObject columns

					if typeof $scope.ngPasteFromOnValidate isnt "function" or $scope.ngPasteFromOnValidate obj, index
						result.push obj
					else if typeof $scope.ngPasteFromOnError is "function"
						$scope.ngPasteFromOnError ngPasteFromErrors.failedValidation, index

				$scope.ngPasteFrom = result

			$scope.$watch "pasteData", ->
				if $scope.pasteData? and 0 < $scope.pasteData.length
					$scope.processPasteData($scope.pasteData)
					$scope.pasteData = null
