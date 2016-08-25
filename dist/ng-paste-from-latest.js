(function() {
  angular.module("ngPasteFrom", []).constant("ngPasteFromErrors", {
    invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH",
    failedValidation: "NGPASTEFROM_FAILED_VALIDATION"
  }).constant("ngPasteFromSeparators", {
    row: /\r\n|\n\r|\n|\r/g,
    column: "\t"
  }).directive("ngPasteFrom", function() {
    return {
      restrict: "A",
      scope: {
        ngPasteFrom: "=",
        ngPasteFromColumns: "=",
        ngPasteFromEnforceColumnCount: "=",
        ngPasteFromRowSeparator: "=",
        ngPasteFromColumnSeparator: "=",
        ngPasteFromPasteOnly: "=",
        ngPasteFromBeforeParse: "=",
        ngPasteFromAfterParseRow: "=",
        ngPasteFromOnValidate: "=",
        ngPasteFromBeforeApply: "=",
        ngPasteFromOnError: "="
      },
      link: function($scope, element, attrs) {
        if ($scope.ngPasteFromColumns == null) {
          console.error("Missing required attribute ngPasteFromColumns.");
        }
        $scope.pasteEvent = function(event) {
          var data, ref;
          if ((event.clipboardData != null) && (event.clipboardData.getData != null)) {
            data = event.clipboardData.getData("text/plain");
          } else if ((event.originalEvent != null) && (event.originalEvent.clipboardData != null) && (event.originalEvent.clipboardData.getData != null)) {
            data = event.originalEvent.clipboardData.getData("text/plain");
          } else if ((window.clipboardData != null) && (window.clipboardData.getData != null)) {
            data = window.clipboardData.getData("Text");
          }
          if (typeof $scope.ngPasteFromBeforeParse === "function") {
            data = $scope.ngPasteFromBeforeParse(data);
          }
          $scope.processPasteData(data);
          if ((ref = $scope.ngPasteFromPasteOnly) != null ? ref : true) {
            return event.preventDefault();
          }
        };
        $scope.changeEvent = function() {
          var data, ref;
          if ((ref = $scope.ngPasteFromPasteOnly) != null ? ref : true) {
            return element.val("");
          } else {
            data = element.val();
            if (typeof $scope.ngPasteFromBeforeParse === "function") {
              data = $scope.ngPasteFromBeforeParse(data);
            }
            return $scope.processPasteData(data);
          }
        };
        element.on("paste", $scope.pasteEvent);
        element.on("keyup", $scope.changeEvent);
        return element.on("change", $scope.changeEvent);
      },
      controller: function($scope, $filter, ngPasteFromErrors, ngPasteFromSeparators) {
        $scope.columnsToObject = function(columns) {
          var column, format, i, index, len, obj;
          obj = {};
          format = $scope.ngPasteFromColumns;
          for (index = i = 0, len = columns.length; i < len; index = ++i) {
            column = columns[index];
            obj[format[index]] = column;
          }
          return obj;
        };
        $scope.getExpectedColumnsLength = function() {
          if (typeof $scope.ngPasteFromColumns === "number") {
            return $scope.ngPasteFromColumns;
          } else {
            return $scope.ngPasteFromColumns.length;
          }
        };
        return $scope.processPasteData = function(data) {
          var columns, expectedColumnsLength, i, index, len, ref, ref1, result, row, rowData, rowResult, rows;
          if (!(data && data.length)) {
            return;
          }
          rows = data.split((ref = $scope.ngPasteFromRowSeparator) != null ? ref : ngPasteFromSeparators.row);
          result = [];
          expectedColumnsLength = $scope.getExpectedColumnsLength();
          for (index = i = 0, len = rows.length; i < len; index = ++i) {
            row = rows[index];
            if (row === "") {
              continue;
            }
            columns = row.split((ref1 = $scope.ngPasteFromColumnSeparator) != null ? ref1 : ngPasteFromSeparators.column);
            rowData = {
              index: index,
              source: row,
              expectedLength: expectedColumnsLength,
              actualLength: columns.length
            };
            if ($scope.ngPasteFromEnforceColumnCount && columns.length !== expectedColumnsLength) {
              if (typeof $scope.ngPasteFromOnError === "function") {
                $scope.ngPasteFromOnError(ngPasteFromErrors.invalidColumnLength, rowData);
              }
              continue;
            }
            if (typeof $scope.ngPasteFromColumns === "number") {
              rowResult = columns;
            } else {
              rowResult = $scope.columnsToObject(columns);
            }
            if (typeof $scope.ngPasteFromOnValidate !== "function" || $scope.ngPasteFromOnValidate(rowResult, rowData)) {
              if (typeof $scope.ngPasteFromAfterParseRow === "function") {
                rowResult = $scope.ngPasteFromAfterParseRow(rowResult, rowData);
              }
              result.push(rowResult);
            } else if (typeof $scope.ngPasteFromOnError === "function") {
              $scope.ngPasteFromOnError(ngPasteFromErrors.failedValidation, rowData);
            }
          }
          if (typeof $scope.ngPasteFromBeforeApply === "function") {
            $scope.ngPasteFromBeforeApply(result);
          }
          return $scope.$apply(function() {
            return $scope.ngPasteFrom = result;
          });
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=ng-paste-from-latest.js.map