angular.module "ngPasteFrom", []
	.constant "ngPasteFromErrors",
		invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH"
		failedValidation: "NGPASTEFROM_FAILED_VALIDATION"

	.constant "ngPasteFromSeparators",
		row: /\r\n|\n\r|\n|\r/g
		column: /\t+/g

	.directive "ngPasteFrom", ->
		restrict: "A"
		scope: 
			ngPasteFrom: "="
			ngPasteFromFormat: "="
			ngPasteFromRowSeparator: "="
			ngPasteFromColumnSeparator: "="
			ngPasteFromOnPaste: "="
			ngPasteFromOnValidate: "="
			ngPasteFromOnError: "="

		link: ($scope, element, attrs) ->
			if not $scope.ngPasteFromFormat?
				console.error "Missing required attribute ngPasteFromFormat."

			element.on "paste", $scope.pasteEvent
			element.on "keyup", $scope.clearSourceElementEvent
			element.on "change", $scope.clearSourceElementEvent

		controller: ($scope, $filter, ngPasteFromErrors, ngPasteFromSeparators, $timeout) ->
			columnsToObject = (columns) ->
				obj = {}
				format = $scope.ngPasteFromFormat
				for column, index in columns
					obj[format[index]] = column
				obj

			processPasteData = (data) ->
				if not (data and data.length)
					return

				rows = data.split $scope.ngPasteFromRowSeparator ? ngPasteFromSeparators.row
				result = []

				for row, index in rows
					if row is ""
						continue

					columns = row.split $scope.ngPasteFromColumnSeparator ? ngPasteFromSeparators.column

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

			$scope.pasteEvent = (event) ->
				element = angular.element event.srcElement
				element.val ""
				$timeout ->
					data = element.val()
					element.val ""
					if typeof $scope.ngPasteFromOnPaste is "function"
						data = $scope.ngPasteFromOnPaste data
					processPasteData data

			$scope.clearSourceElementEvent = (event) ->
				element = angular.element event.srcElement
				element.val ""
