(function() {
  angular.module("ngPasteFrom", []).constant("ngPasteFromErrors", {
    invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH",
    failedValidation: "NGPASTEFROM_FAILED_VALIDATION"
  }).directive("ngPasteFrom", function() {
    return {
      restrict: "A",
      scope: {
        ngPasteFrom: "=",
        ngPasteFromFormat: "=",
        ngPasteFromOnPaste: "=",
        ngPasteFromOnValidate: "=",
        ngPasteFromOnError: "="
      },
      link: function($scope, element, attrs) {
        if ($scope.ngPasteFromFormat == null) {
          console.error("Missing required attribute ngPasteFromFormat.");
        }
        element.on("paste", function() {
          element.val("");
          return $scope.hasPasted = true;
        });
        return element.on("keyup", function() {
          if ($scope.hasPasted) {
            $scope.$apply(function() {
              return $scope.pasteData = $scope.ngPasteFromOnPaste(element.val());
            });
            $scope.hasPasted = false;
          }
          return element.val("");
        });
      },
      controller: function($scope, $filter, ngPasteFromErrors) {
        var columnsToObject, defaultOnError, defaultOnPaste, defaultOnValidate, splitToColumns, splitToRows;
        defaultOnPaste = function(data) {
          return data;
        };
        defaultOnError = function(error, index) {
          return console.error("ngPasteFromError: index " + index + " error: " + error);
        };
        defaultOnValidate = function() {
          return true;
        };
        if ($scope.ngPasteFromOnPaste == null) {
          $scope.ngPasteFromOnPaste = defaultOnPaste;
        }
        if ($scope.ngPasteFromOnError == null) {
          $scope.ngPasteFromOnError = defaultOnError;
        }
        if ($scope.ngPasteFromOnValidate == null) {
          $scope.ngPasteFromOnValidate = defaultOnValidate;
        }
        splitToRows = function(data) {
          var lineEnding, lineEndingsRegExp;
          lineEndingsRegExp = /\r\n|\n\r|\n|\r/g;
          lineEnding = "\n";
          return data.replace(lineEndingsRegExp, lineEnding).split(lineEnding);
        };
        splitToColumns = function(row) {
          var separatorChar;
          separatorChar = "\t";
          return row.split(separatorChar);
        };
        columnsToObject = function(columns) {
          var column, format, index, obj, _i, _len;
          obj = {};
          format = $scope.ngPasteFromFormat;
          for (index = _i = 0, _len = columns.length; _i < _len; index = ++_i) {
            column = columns[index];
            obj[format[index]] = column;
          }
          return obj;
        };
        $scope.processPasteData = function(data) {
          var columns, index, obj, result, row, rows, _i, _len;
          rows = splitToRows(data);
          result = [];
          for (index = _i = 0, _len = rows.length; _i < _len; index = ++_i) {
            row = rows[index];
            columns = splitToColumns(row);
            if (columns.length !== $scope.ngPasteFromFormat.length) {
              $scope.ngPasteFromOnError(ngPasteFromErrors.invalidColumnLength, index);
              continue;
            }
            obj = columnsToObject(columns);
            if ($scope.ngPasteFromOnValidate(obj, index)) {
              result.push(obj);
            } else {
              $scope.ngPasteFromOnError(ngPasteFromErrors.failedValidation, index);
            }
          }
          return $scope.ngPasteFrom = result;
        };
        return $scope.$watch("pasteData", function() {
          if (($scope.pasteData != null) && 0 < $scope.pasteData.length) {
            $scope.processPasteData($scope.pasteData);
            return $scope.pasteData = null;
          }
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=ng-paste-from-latest.js.map