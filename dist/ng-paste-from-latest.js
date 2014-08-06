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
        ngPasteFromBeforeParse: "=",
        ngPasteFromOnValidate: "=",
        ngPasteFromOnError: "="
      },
      link: function($scope, element, attrs) {
        if ($scope.ngPasteFromColumns == null) {
          console.error("Missing required attribute ngPasteFromColumns.");
        }
        $scope.pasteEvent = function(event) {
          var clipboardData, data;
          clipboardData = window.clipboardData || event.clipboardData || event.originalEvent && event.originalEvent.clipboardData;
          data = clipboardData.getData("text/plain");
          event.preventDefault();
          if (typeof $scope.ngPasteFromBeforeParse === "function") {
            data = $scope.ngPasteFromBeforeParse(data);
          }
          $scope.processPasteData(data);
          return false;
        };
        $scope.clearSourceElementEvent = function() {
          return element.val("");
        };
        element.on("paste", $scope.pasteEvent);
        element.on("keyup", $scope.clearSourceElementEvent);
        return element.on("change", $scope.clearSourceElementEvent);
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
        $scope.getColumnsLength = function() {
          if (typeof $scope.ngPasteFromColumns === "number") {
            return $scope.ngPasteFromColumns;
          } else {
            return $scope.ngPasteFromColumns.length;
          }
        };
        return $scope.processPasteData = function(data) {
          var columns, columnsLength, index, obj, result, row, rows, _i, _len, _ref, _ref1;
          if (!(data && data.length)) {
            return;
          }
          rows = data.split((_ref = $scope.ngPasteFromRowSeparator) != null ? _ref : ngPasteFromSeparators.row);
          result = [];
          columnsLength = $scope.getColumnsLength();
          for (index = _i = 0, _len = rows.length; _i < _len; index = ++_i) {
            row = rows[index];
            if (row === "") {
              continue;
            }
            columns = row.split((_ref1 = $scope.ngPasteFromColumnSeparator) != null ? _ref1 : ngPasteFromSeparators.column);
            if (columns.length !== columnsLength) {
              if (typeof $scope.ngPasteFromOnError === "function") {
                $scope.ngPasteFromOnError(ngPasteFromErrors.invalidColumnLength, index);
              }
              continue;
            }
            if (typeof $scope.ngPasteFromColumns === "number") {
              obj = columns;
            } else {
              obj = $scope.columnsToObject(columns);
            }
            if (typeof $scope.ngPasteFromOnValidate !== "function" || $scope.ngPasteFromOnValidate(obj, index)) {
              result.push(obj);
            } else if (typeof $scope.ngPasteFromOnError === "function") {
              $scope.ngPasteFromOnError(ngPasteFromErrors.failedValidation, index);
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