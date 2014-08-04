(function() {
  var ngPasteFrom;

  ngPasteFrom = angular.module("ngPasteFrom", []);

  ngPasteFrom.directive("ngPasteFrom", function() {
    return {
      restrict: "E",
      replace: true,
      template: '<p>I like turtles</p>',
      scope: {
        time: "=",
        disabled: "="
      },
      link: function($scope, element, attrs) {
        var _i, _j, _results, _results1;
        $scope.minutes = (function() {
          _results = [];
          for (_i = 0; _i <= 59; _i++){ _results.push(_i); }
          return _results;
        }).apply(this);
        return $scope.hours = (function() {
          _results1 = [];
          for (_j = 0; _j <= 23; _j++){ _results1.push(_j); }
          return _results1;
        }).apply(this);
      },
      controller: function($scope, $filter) {
        var split;
        $scope.hour = "00";
        $scope.minute = "00";
        if ($scope.time != null) {
          split = $scope.time.split(":");
          $scope.hour = split[0];
          $scope.minute = split[1];
        }
        $scope.updateScope = function() {};
        $scope.$watch("hour", $scope.updateScope);
        return $scope.$watch("minute", $scope.updateScope);
      }
    };
  });

}).call(this);

//# sourceMappingURL=ng-paste-from-latest.js.map