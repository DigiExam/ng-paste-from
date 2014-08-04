(function() {
  var ngPasteFrom;

  ngPasteFrom = angular.module("ngPasteFrom", []);

  ngPasteFrom.constant("ngPasteFromErrors", {
    invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH",
    failedValidation: "NGPASTEFROM_FAILED_VALIDATION"
  }).directive("ngPasteFrom", function() {
    return {
      restrict: "A",
      scope: {
        ngPasteFrom: "=",
        ngPasteFromFormat: "=",
        ngPasteFromOnValidate: "=",
        ngPasteFromOnError: "="
      },
      link: function($scope, element, attrs) {
        if ($scope.ngPasteFromFormat == null) {
          console.error("Missing required attribute ngPasteFromFormat.");
        }
        element.on("paste", function(event) {
          element.val("");
          return $scope.hasPasted = true;
        });
        return element.on("keyup", function(event) {
          if ($scope.hasPasted) {
            $scope.$apply(function() {
              return $scope.pasteData = element.val();
            });
            $scope.hasPasted = false;
          }
          return element.val("");
        });
      },
      controller: function($scope, $filter, ngPasteFromErrors) {
        var columnsToObject, defaultOnError, defaultOnValidate, splitToColumns, splitToRows;
        defaultOnError = function(error, index) {
          return console.error("ngPasteFromError: index " + index + " error: " + error);
        };
        defaultOnValidate = function(object, index) {
          return true;
        };
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
          var c, format, i, o, _i, _len;
          o = {};
          format = $scope.ngPasteFromFormat;
          for (i = _i = 0, _len = columns.length; _i < _len; i = ++_i) {
            c = columns[i];
            o[format[i]] = c;
          }
          return o;
        };
        $scope.processPasteData = function(data) {
          var columns, i, o, r, result, rows, _i, _len;
          rows = splitToRows(data);
          result = [];
          for (i = _i = 0, _len = rows.length; _i < _len; i = ++_i) {
            r = rows[i];
            columns = splitToColumns(r);
            if (columns.length !== $scope.ngPasteFromFormat.length) {
              $scope.ngPasteFromOnError(ngPasteFromErrors.invalidColumnLength, i);
              continue;
            }
            o = columnsToObject(columns);
            if ($scope.ngPasteFromOnValidate(o, i)) {
              result.push(o);
            } else {
              $scope.ngPasteFromOnError(ngPasteFromErrors.failedValidation, i);
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