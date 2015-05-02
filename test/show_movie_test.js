describe('Show movie', function(){
	var controller, scope;

	var FirebaseServiceMock, RouteParamsMock;

  	beforeEach(function(){
  		// Lisää moduulisi nimi tähän
    	module('MovieApp');

			FirebaseServiceMock = (function(){
				var movies = [
					{id: '0', movieName: "Hobbit: Unexpected Journey", director: "Peter Jackson", releaseYear: "2010", description: "hobbit goes to a trip" },
					{id: '1', movieName: "Alien", director: "Ridley Scott", releaseYear: "1979", description: "Find of alien lifeform ends badly"}
				];

				function isValidField(field) {
					return (field != 'undefined' && field != null && field != "");
				}

				return {
				  isValidMovie: function (movie) {
				    try{
				      return (isValidField(movie.movieName) && isValidField(movie.director)
				              && isValidField(movie.releaseYear) && isValidField(movie.description));
				    }

				    catch(err) {
				      return false;
				    }
				  },

				  getMovies: function() {
				    return movies;
				  },

				  addMovie: function(movie) {
				    if (!this.isValidMovie(movie)) {
				      return false;
				    }

				    movies.push(movie);
				    return true;
				  },

				  removeMovie: function(movie) {
				    movies.splice(movies.indexOf(movie), 1);
				  },

				  editMovie: function(movie) {
				    if (!this.isValidMovie(movie)) {
				      return false;
				    }

						for(var i = 0;i < movies.length;i ++) {
							if(movies[i].id === movie.id) {
								movies[i] = movie;
								return true;
							}
						}

				    return false;
				  },

					getMovie: function(key, done){
      			if(key == '1234'){
        			done({
								id: '1234',
          			movieName: 'Testi',
          			director: 'Editor',
          			releaseYear: '2015',
          			description: 'Mahtava leffa!'
        			});
      			}

						else{
        			done(null);
      			}
    			}
				}
			})();

		spyOn(FirebaseServiceMock, 'getMovie').and.callThrough();

    	// Injektoi toteuttamasi kontrolleri tähän
	    inject(function($controller, $rootScope) {
	      scope = $rootScope.$new();
	      // Muista vaihtaa oikea kontrollerin nimi!
	      controller = $controller('ShowMovieController', {
	        $scope: scope,
	        FirebaseService: FirebaseServiceMock,
	       	$routeParams: {key: '1234'}
	      });
	    });

  	});

  	/*
  	* Testaa alla esitettyjä toimintoja kontrollerissasi
  	*/

  	/*
  	* Testaa, että Firebasesta (mockilta) saatu elokuva löytyy kontrollerista.
  	* Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota
  	* käyttämällä toBeCalled-oletusta.
	*/
	it('should show current movie from Firebase', function() {
		expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
		expect(scope.movie).toEqual({
			id: '1234',
			movieName: 'Testi',
			director: 'Editor',
			releaseYear: '2015',
			description: 'Mahtava leffa!'
		});
	});
});
