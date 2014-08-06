angular.module "ngPasteFrom", []
	.constant "ngPasteFromErrors",
		invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH"
		failedValidation: "NGPASTEFROM_FAILED_VALIDATION"

	.constant "ngPasteFromSeparators",
		row: /\r\n|\n\r|\n|\r/g
		column: "\t"

	.directive "ngPasteFrom", ->
		restrict: "A"
		scope: 
			ngPasteFrom: "="
			ngPasteFromColumns: "="
			ngPasteFromRowSeparator: "="
			ngPasteFromColumnSeparator: "="
			ngPasteFromOnPaste: "="
			ngPasteFromOnValidate: "="
			ngPasteFromOnError: "="

		link: ($scope, element, attrs) ->
			if not $scope.ngPasteFromColumns?
				console.error "Missing required attribute ngPasteFromColumns."

			$scope.pasteEvent = (event) ->
				clipboardData = window.clipboardData ? event.clipboardData
				data = clipboardData.getData "text/plain"
				event.preventDefault()
				if typeof $scope.ngPasteFromOnPaste is "function"
					data = $scope.ngPasteFromOnPaste data
				$scope.processPasteData data
				false

			$scope.clearSourceElementEvent = ->
				element.val ""

			element.on "paste", $scope.pasteEvent
			element.on "keyup", $scope.clearSourceElementEvent
			element.on "change", $scope.clearSourceElementEvent

		controller: ($scope, $filter, ngPasteFromErrors, ngPasteFromSeparators) ->
			$scope.columnsToObject = (columns) ->
				obj = {}
				format = $scope.ngPasteFromColumns
				for column, index in columns
					obj[format[index]] = column
				obj

			$scope.getColumnsLength = ->
				if typeof $scope.ngPasteFromColumns is "number"
					$scope.ngPasteFromColumns
				else
					$scope.ngPasteFromColumns.length

			$scope.processPasteData = (data) ->
				if not (data and data.length)
					return

				rows = data.split $scope.ngPasteFromRowSeparator ? ngPasteFromSeparators.row
				result = []
				columnsLength = $scope.getColumnsLength()

				for row, index in rows
					if row is ""
						continue

					columns = row.split $scope.ngPasteFromColumnSeparator ? ngPasteFromSeparators.column

					if columns.length isnt columnsLength
						if typeof $scope.ngPasteFromOnError is "function"
							$scope.ngPasteFromOnError ngPasteFromErrors.invalidColumnLength, index
						continue

					if typeof $scope.ngPasteFromColumns is "number"
						obj = columns
					else
						obj = $scope.columnsToObject columns

					if typeof $scope.ngPasteFromOnValidate isnt "function" or $scope.ngPasteFromOnValidate obj, index
						result.push obj
					else if typeof $scope.ngPasteFromOnError is "function"
						$scope.ngPasteFromOnError ngPasteFromErrors.failedValidation, index

				$scope.$apply ->
					$scope.ngPasteFrom = result
