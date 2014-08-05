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
          var pasteData;
          if ($scope.hasPasted) {
            pasteData = element.val();
            if (typeof $scope.ngPasteFromOnPaste === "function") {
              pasteData = $scope.ngPasteFromOnPaste(pasteData);
            }
            $scope.$apply(function() {
              return $scope.pasteData = pasteData;
            });
            $scope.hasPasted = false;
          }
          return element.val("");
        });
      },
      controller: function($scope, $filter, ngPasteFromErrors) {
        var columnsToObject, splitToColumns, splitToRows;
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
              if (typeof $scope.ngPasteFromOnError === "function") {
                $scope.ngPasteFromOnError(ngPasteFromErrors.invalidColumnLength, index);
              }
              continue;
            }
            obj = columnsToObject(columns);
            if (typeof $scope.ngPasteFromOnValidate !== "function" || $scope.ngPasteFromOnValidate(obj, index)) {
              result.push(obj);
            } else if (typeof $scope.ngPasteFromOnError === "function") {
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