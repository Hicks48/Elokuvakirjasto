describe('Add movie', function(){
	var controller, scope;

	var FirebaseServiceMock;

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
      			if(key == 'abc123'){
        			done({
								id: '3',
          			name: 'Testi',
          			director: 'Editor',
          			release: 2015,
          			description: 'Mahtava leffa!'
        			});
      			}

						else{
        			done(null);
      			}
    			}
				}
			})();

			// Lisää vakoilijat
	    spyOn(FirebaseServiceMock, 'addMovie').and.callThrough();

    	// Injektoi toteuttamasi kontrolleri tähän
	    inject(function($controller, $rootScope) {
	      scope = $rootScope.$new();
	      // Muista vaihtaa oikea kontrollerin nimi!
	      controller = $controller('AddMovieController', {
	        $scope: scope,
	        FirebaseService: FirebaseServiceMock
	      });
	    });

  	});

  	/*
  	* Testaa alla esitettyjä toimintoja kontrollerissasi
  	*/

  	/*
  	* Testaa, että käyttäjä pystyy lisäämään elokuvan oikeilla tiedoilla.
  	* Muista myös tarkistaa, että Firebasen kanssa keskustelevasta palvelusta
  	* on kutsutta oikeaa funktiota lisäämällä siihen vakoilijan ja käyttämällä
  	* toBeCalled-oletusta.
	*/
	it('should be able to add a movie by its name, director, release date and description', function(){
		scope.movie = {id: '4', movieName: "testi", director: "testi ohjaaja", releaseYear: "2015", description: "hmm..."};
		scope.addMovie();
		expect(FirebaseServiceMock.getMovies().length).toBe(3);
		expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();
	});

	/*
	* Testaa, ettei käyttäjä pysty lisäämään elokuvaa väärillä tiedoilla.
	* Muista myös tarkistaa, että Firebasen kanssa keskustelevasta palvelusta
	* EI kutsuta funktiota, joka hoitaa muokkauksen. Voit käyttää siihen
	* not.toBeCalled-oletusta (muista not-negaatio!).
	*/
	it('should not be able to add a movie if its name, director, release date or description is empty', function(){
		scope.movie = {id: '4', movieName: "", director: "testi ohjaaja", releaseYear: "2015", description: "hmm..."};
		scope.addMovie();
		expect(FirebaseServiceMock.getMovies().length).toBe(2);
		expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();

		scope.movie = {id: '4', movieName: "testi", director: "", releaseYear: "2015", description: "hmm..."};
		scope.addMovie();
		expect(FirebaseServiceMock.getMovies().length).toBe(2);
		expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();

		scope.movie = {id: '4', movieName: "testi", director: "testi ohjaaja", releaseYear: "", description: "hmm..."};
		scope.addMovie();
		expect(FirebaseServiceMock.getMovies().length).toBe(2);
		expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();

		scope.movie = {id: '4', movieName: "testi", director: "testi ohjaaja", releaseYear: "2015", description: ""};
		scope.addMovie();
		expect(FirebaseServiceMock.getMovies().length).toBe(2);
		expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();
	});
});
