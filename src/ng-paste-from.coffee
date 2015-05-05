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
			ngPasteFromPasteOnly: "="
			ngPasteFromBeforeParse: "="
			ngPasteFromOnValidate: "="
			ngPasteFromOnError: "="

		link: ($scope, element, attrs) ->
			if not $scope.ngPasteFromColumns?
				console.error "Missing required attribute ngPasteFromColumns."

			$scope.pasteEvent = (event) ->
				if event.clipboardData? && event.clipboardData.getData? # Standard
					data = event.clipboardData.getData "text/plain"
				else if event.originalEvent? && event.originalEvent.clipboardData? && event.originalEvent.clipboardData.getData? # jQuery
					data = event.originalEvent.clipboardData.getData "text/plain"
				else if window.clipboardData? && window.clipboardData.getData? # Internet Explorer
					data = window.clipboardData.getData "Text"

				if typeof $scope.ngPasteFromBeforeParse is "function"
					data = $scope.ngPasteFromBeforeParse data
				$scope.processPasteData data
				if $scope.ngPasteFromPasteOnly ? true
					event.preventDefault()

			$scope.changeEvent = ->
				if $scope.ngPasteFromPasteOnly ? true
					element.val ""
				else
					data = element.val()
					if typeof $scope.ngPasteFromBeforeParse is "function"
						data = $scope.ngPasteFromBeforeParse data
					$scope.processPasteData data

			element.on "paste", $scope.pasteEvent
			element.on "keyup", $scope.changeEvent
			element.on "change", $scope.changeEvent

		controller: ($scope, $filter, ngPasteFromErrors, ngPasteFromSeparators) ->
			$scope.columnsToObject = (columns) ->
				obj = {}
				format = $scope.ngPasteFromColumns
				for column, index in columns
					obj[format[index]] = column
				obj

			$scope.getExpectedColumnsLength = ->
				if typeof $scope.ngPasteFromColumns is "number"
					$scope.ngPasteFromColumns
				else
					$scope.ngPasteFromColumns.length

			$scope.processPasteData = (data) ->
				if not (data and data.length)
					return

				rows = data.split $scope.ngPasteFromRowSeparator ? ngPasteFromSeparators.row
				result = []
				expectedColumnsLength = $scope.getExpectedColumnsLength()

				for row, index in rows
					if row is ""
						continue

					columns = row.split $scope.ngPasteFromColumnSeparator ? ngPasteFromSeparators.column

					rowData =
						index: index
						source: row
						expectedLength: expectedColumnsLength
						actualLength: columns.length

					if columns.length isnt expectedColumnsLength
						if typeof $scope.ngPasteFromOnError is "function"
							$scope.ngPasteFromOnError ngPasteFromErrors.invalidColumnLength, rowData
						continue

					if typeof $scope.ngPasteFromColumns is "number"
						rowResult = columns
					else
						rowResult = $scope.columnsToObject columns

					if typeof $scope.ngPasteFromOnValidate isnt "function" or $scope.ngPasteFromOnValidate rowResult, rowData
						result.push rowResult
					else if typeof $scope.ngPasteFromOnError is "function"
						$scope.ngPasteFromOnError ngPasteFromErrors.failedValidation, rowData

				$scope.$apply ->
					$scope.ngPasteFrom = result
