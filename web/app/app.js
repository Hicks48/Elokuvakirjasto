var MovieApp = angular.module('MovieApp', ['ngRoute', 'firebase']);

MovieApp.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller: 'MovieController',
    templateUrl: 'app/views/movie_list.html'
  })

  .when('/movies', {
    controller: 'MovieController',
    templateUrl: 'app/views/movie_list.html'
  })

  .when('/movies/new', {
    controller: 'AddMovieController',
    templateUrl: 'app/views/new_movie_form.html'
  })

  .when('/movies/:key', {
    controller: 'ShowMovieController',
    templateUrl: 'app/views/show_movie.html'
  })

  .when('/movies/:key/edit', {
    controller: 'EditMovieController',
    templateUrl: 'app/views/edit_movie.html'
  });
});
