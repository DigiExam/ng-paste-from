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
					$scope.$apply ->
						$scope.pasteData = $scope.ngPasteFromOnPaste element.val()
					$scope.hasPasted = false
				element.val ""

		controller: ($scope, $filter, ngPasteFromErrors) ->
			defaultOnPaste = (data) -> data

			defaultOnError = (error, index) ->
				console.error "ngPasteFromError: index " + index + " error: " + error

			defaultOnValidate = -> true

			# Assign default callbacks
			if not $scope.ngPasteFromOnPaste? then $scope.ngPasteFromOnPaste = defaultOnPaste
			if not $scope.ngPasteFromOnError? then $scope.ngPasteFromOnError = defaultOnError
			if not $scope.ngPasteFromOnValidate? then $scope.ngPasteFromOnValidate = defaultOnValidate

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
						$scope.ngPasteFromOnError ngPasteFromErrors.invalidColumnLength, index
						continue

					obj = columnsToObject columns

					if $scope.ngPasteFromOnValidate obj, index
						result.push obj
					else
						$scope.ngPasteFromOnError ngPasteFromErrors.failedValidation, index

				$scope.ngPasteFrom = result

			$scope.$watch "pasteData", ->
				if $scope.pasteData? and 0 < $scope.pasteData.length
					$scope.processPasteData($scope.pasteData)
					$scope.pasteData = null
