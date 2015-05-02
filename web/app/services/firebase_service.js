MovieApp.service('FirebaseService', function($firebase) {
  var firebaseRef = new Firebase("vivid-heat-2690.firebaseio.com/movies");
  var syncMovies = $firebase(firebaseRef);
  var movies = syncMovies.$asArray();

  function isValidField(field) {
    return (field != 'undefined' && field != null && field != "");
  }

  this.isValidMovie = function (movie) {
    try{
      return (isValidField(movie.movieName) && isValidField(movie.director)
              && isValidField(movie.releaseYear) && isValidField(movie.description));
    }

    catch(err) {
      return false;
    }
  }

  this.getMovies = function() {
    return movies;
  }

  this.addMovie = function(movie) {
    if (!this.isValidMovie(movie)) {
      return false;
    }

    movies.$add(movie);
    return true;
  }

  this.removeMovie = function(movie) {
    movies.$remove(movie);
  }

  this.editMovie = function(movie) {
    if (!this.isValidMovie(movie)) {
      return false;
    }

    movies.$save(movie);
    return true;
  }

  this.getMovie = function(key, done) {
    movies.$loaded(function() {
      done(movies.$getRecord(key));
    });
  }
});
