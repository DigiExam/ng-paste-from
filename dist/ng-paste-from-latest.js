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
        ngPasteFromRowSeparator: "=",
        ngPasteFromColumnSeparator: "=",
        ngPasteFromPasteOnly: "=",
        ngPasteFromBeforeParse: "=",
        ngPasteFromOnValidate: "=",
        ngPasteFromOnError: "="
      },
      link: function($scope, element, attrs) {
        if ($scope.ngPasteFromColumns == null) {
          console.error("Missing required attribute ngPasteFromColumns.");
        }
        $scope.pasteEvent = function(event) {
          var data, _ref;
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
          if ((_ref = $scope.ngPasteFromPasteOnly) != null ? _ref : true) {
            return event.preventDefault();
          }
        };
        $scope.changeEvent = function() {
          var data, _ref;
          if ((_ref = $scope.ngPasteFromPasteOnly) != null ? _ref : true) {
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
          var column, format, index, obj, _i, _len;
          obj = {};
          format = $scope.ngPasteFromColumns;
          for (index = _i = 0, _len = columns.length; _i < _len; index = ++_i) {
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
          var columns, expectedColumnsLength, index, result, row, rowData, rowResult, rows, _i, _len, _ref, _ref1;
          if (!(data && data.length)) {
            return;
          }
          rows = data.split((_ref = $scope.ngPasteFromRowSeparator) != null ? _ref : ngPasteFromSeparators.row);
          result = [];
          expectedColumnsLength = $scope.getExpectedColumnsLength();
          for (index = _i = 0, _len = rows.length; _i < _len; index = ++_i) {
            row = rows[index];
            if (row === "") {
              continue;
            }
            columns = row.split((_ref1 = $scope.ngPasteFromColumnSeparator) != null ? _ref1 : ngPasteFromSeparators.column);
            rowData = {
              index: index,
              source: row,
              expectedLength: expectedColumnsLength,
              actualLength: columns.length
            };
            if (columns.length !== expectedColumnsLength) {
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
              result.push(rowResult);
            } else if (typeof $scope.ngPasteFromOnError === "function") {
              $scope.ngPasteFromOnError(ngPasteFromErrors.failedValidation, rowData);
            }
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