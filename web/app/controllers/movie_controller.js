MovieApp.controller('MovieController', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService){

  function updateMovies() {
    $scope.movies = FirebaseService.getMovies();
  }

  $scope.removeMovie = function (movie) {
    FirebaseService.removeMovie(movie);
  }

  // Initialize index.html
  updateMovies();
}]);

MovieApp.controller('AddMovieController', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  $scope.addMovie = function() {
    var success = FirebaseService.addMovie($scope.movie);

    if(!success) {
      alert("Error no movie created. Invalid fields!");
    }

    else {
      $scope.movie = null;
      $location.path("/movies");
    }
  };

}]);


MovieApp.controller('ShowMovieController', ['$scope', '$location', 'FirebaseService', '$routeParams', function($scope, $location, FirebaseService, $routeParams) {
  $scope.updateSite = function () {
    FirebaseService.getMovie($routeParams.key, function(movie) { $scope.movie =  movie; });
  }

  $scope.updateSite();
}]);

MovieApp.controller('EditMovieController', ['$scope', '$location', 'FirebaseService', '$routeParams', function($scope, $location, FirebaseService, $routeParams) {
  $scope.updateSite = function () {
    FirebaseService.getMovie($routeParams.key, function(movie) { $scope.movie =  movie; });
  }

  $scope.editMovie = function() {
    if(!FirebaseService.isValidMovie($scope.movie)) {
      alert("Editing not succesful. Invalid fields!");
      return;
    }

    FirebaseService.editMovie($scope.movie);

    $location.path("/movies/" + $scope.movie.$id);
  };

  $scope.updateSite();
}]);
