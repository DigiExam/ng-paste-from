(function() {
  angular.module("ngPasteFrom", []).constant("ngPasteFromErrors", {
    invalidColumnLength: "NGPASTEFROM_INVALID_COLUMN_LENGTH",
    failedValidation: "NGPASTEFROM_FAILED_VALIDATION"
  }).constant("ngPasteFromSeparators", {
    row: /\r\n|\n\r|\n|\r/g,
    column: /\t+/g
  }).directive("ngPasteFrom", function() {
    return {
      restrict: "A",
      scope: {
        ngPasteFrom: "=",
        ngPasteFromFormat: "=",
        ngPasteFromRowSeparator: "=",
        ngPasteFromColumnSeparator: "=",
        ngPasteFromOnPaste: "=",
        ngPasteFromOnValidate: "=",
        ngPasteFromOnError: "="
      },
      link: function($scope, element, attrs) {
        if ($scope.ngPasteFromFormat == null) {
          console.error("Missing required attribute ngPasteFromFormat.");
        }
        element.on("paste", $scope.pasteEvent);
        element.on("keyup", $scope.clearSourceElementEvent);
        return element.on("change", $scope.clearSourceElementEvent);
      },
      controller: function($scope, $filter, ngPasteFromErrors, ngPasteFromSeparators, $timeout) {
        var columnsToObject, processPasteData;
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
        processPasteData = function(data) {
          var columns, index, obj, result, row, rows, _i, _len, _ref, _ref1;
          if (!(data && data.length)) {
            return;
          }
          rows = data.split((_ref = $scope.ngPasteFromRowSeparator) != null ? _ref : ngPasteFromSeparators.row);
          result = [];
          for (index = _i = 0, _len = rows.length; _i < _len; index = ++_i) {
            row = rows[index];
            columns = row.split((_ref1 = $scope.ngPasteFromColumnSeparator) != null ? _ref1 : ngPasteFromSeparators.column);
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
        $scope.pasteEvent = function(event) {
          var element;
          element = angular.element(event.srcElement);
          element.val("");
          return $timeout(function() {
            var data;
            data = element.val();
            element.val("");
            if (typeof $scope.ngPasteFromOnPaste === "function") {
              data = $scope.ngPasteFromOnPaste(data);
            }
            return processPasteData(data);
          });
        };
        return $scope.clearSourceElementEvent = function(event) {
          var element;
          element = angular.element(event.srcElement);
          return element.val("");
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=ng-paste-from-latest.js.map