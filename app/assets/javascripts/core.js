var hnotes = angular.module('hnotes',['treeControl']);


hnotes.controller('bookController',function($scope){
  $scope.updateBook = function() {

  }
  $scope.addPage = function() {
    $scope.pages.push({title: $scope.page.title});
  }

});

hnotes.controller('treeCtrl', function($scope, $timeout) {
$scope.treeOptions = {
    nodeChildren: "children",
    dirSelectable: true,
    injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a3",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
    }
};
$scope.book =
[
    { "name" : "Joe", "age" : "21", "children" : [
        { "name" : "Smith", "age" : "42", "children" : [] },
        { "name" : "Gary", "age" : "21", "children" : [
            { "name" : "Jenifer", "age" : "23", "children" : [
                { "name" : "Dani", "age" : "32", "children" : [] },
                { "name" : "Max", "age" : "34", "children" : [] }
            ]}
        ]}
    ]},
    { "name" : "Albert", "age" : "33", "children" : [] },
    { "name" : "Ron", "age" : "29", "children" : [] }
];
});

            $scope.label = "label from external scope";
            $scope.treedata=createSubTree(3, 4, "");
            function createSubTree(level, width, prefix) {
                if (level > 0) {
                    var res = [];
                    for (var i=1; i <= width; i++)
                        res.push({ "label" : "Node " + prefix + i, "id" : "id"+prefix + i, "children": createSubTree(level-1, width, prefix + i +".") });
                    return res;
                }
                else
                    return [];
            }

hnotes.factory('booksFactory',function($http) {
  var factory = {};
  factory.getBooks = function() {

  };
  factory.putBooks = function() {

  };

});




