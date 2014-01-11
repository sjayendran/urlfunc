//Setting up route
angular.module('groovly').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/articles', {templateUrl: 'views/articles/list.html'}).
        when('/articles/create', {templateUrl: 'views/articles/create.html'}).
        when('/articles/:articleId/edit', {templateUrl: 'views/articles/edit.html'}).
        when('/articles/:articleId', {templateUrl: 'views/articles/view.html'}).
        when('/shares', {templateUrl: 'views/shares/main.html'}).
        when('/s', {templateUrl: 'partials/current.html',controller: 'SongCtrl'}).
        when('/s/:songId', {templateUrl: 'partials/current.html',controller: 'SongCtrl'}).
        when('/', {templateUrl: 'views/index.html'}).
        otherwise({redirectTo: '/'});
    }
])
.controller('SongCtrl', ['$scope', '$routeParams', '$sce', function ($scope, $routeParams, $sce) {
        $scope.name = "SongCtrl";
        $scope.params = $routeParams;
        console.log('this is the $scope object in the song controller');
        console.log($scope);
        console.log('this is the route params:');
        console.log($routeParams);
        
        $scope.getYTURL = function(targetID){
          return $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+targetID+"?version=3&controls=0&enablejsapi=1&rel=0&showinfo=0&color=white&iv_load_policy=3");
        }
	}
]);

//Setting HTML5 Location Mode
angular.module('groovly').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);