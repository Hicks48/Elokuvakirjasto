describe('Edit movie', function(){
	var controller, scope;

	var FirebaseServiceMock, RouteParamsMock;

  	beforeEach(function(){
  		// Lisää moduulisi nimi tähän
    	module('MovieApp');

			FirebaseServiceMock = (function(){
				var movies = [
					{id: '0', movieName: "Hobbit: Unexpected Journey", director: "Peter Jackson", releaseYear: "2010", description: "hobbit goes to a trip" },
					{id: '1', movieName: "Alien", director: "Ridley Scott", releaseYear: "1979", description: "Find of alien lifeform ends badly"},
					{id: '1234', movieName: 'Testi', director: 'Editor', releaseYear: '2015', description: 'Mahtava leffa!'}
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
								alert("here!");
								movies[i] = movie;
								return true;
							}
						}

				    return false;
				  },

					getMovie: function(key, done){
      			if(key == '1234'){
							for(var i = 0;i < movies.length;i ++) {
								if(movies[i].id === key) {
									var m = movies[i];
									done({id: m.id, movieName: m.movieName, director: m.director,
											releaseYear: m.releaseYear, description: m.description});
									return;
								}
							}
      			}

						else{
        			done(null);
      			}
    			}
				}
			})();

			spyOn(FirebaseServiceMock, 'getMovie').and.callThrough();
			spyOn(FirebaseServiceMock, 'editMovie').and.callThrough();

    	// Injektoi toteuttamasi kontrolleri tähän
	    inject(function($controller, $rootScope) {
	      scope = $rootScope.$new();
	      // Muista vaihtaa oikea kontrollerin nimi!
	      controller = $controller('EditMovieController', {
	        $scope: scope,
	        FirebaseService: FirebaseServiceMock,
	        $routeParams: {key: '1234'}
	      });
	    });

	    // Lisää vakoilijat
	    // spyOn(FirebaseServiceMock, 'jokuFunktio').and.callThrough();
  	});

  	/*
  	* Testaa alla esitettyjä toimintoja kontrollerissasi
  	*/

  	/*
  	* Testaa, että muokkauslomakkeen tiedot täytetään muokattavan elokuvan tiedoilla.
  	* Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
  	* käyttämällä toBeCalled-oletusta.
  	*/
  	it('should fill the edit form with the current information about the movie', function(){
  		expect(scope.movie).toEqual({
				id: '1234',
				movieName: 'Testi',
				director: 'Editor',
				releaseYear: '2015',
				description: 'Mahtava leffa!'
			});

			expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
  	})

  	/*
  	* Testaa, että käyttäjä pystyy muokkaamaan elokuvaa, jos tiedot ovat oikeat
	* Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
  	* käyttämällä toBeCalled-oletusta.
	*/
	it('should be able to edit a movie by its name, director, release date and description', function(){
		scope.movie.movieName = 'Muokattu Nimi';
		scope.movie.director = 'Muokattu ohjaaja';
		scope.movie.releaseYear = '2016';
		scope.movie.description = 'Muokattu kuvaus';

		scope.editMovie();
		scope.updateSite();

		expect(scope.movie).toEqual({id: '1234',
															 		movieName: 'Muokattu Nimi',
															 		director: 'Muokattu ohjaaja',
																	releaseYear: '2016',
																	description: 'Muokattu kuvaus'});

		expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
		expect(FirebaseServiceMock.editMovie).toHaveBeenCalled();
	});

	/*
	* Testaa, ettei käyttäjä pysty muokkaaman elokuvaa, jos tiedot eivät ole oikeat
	* Testaa myös, että Firebasea käyttävästä palvelusta ei kutsuta muokkaus-funktiota,
  	* käyttämällä not.toBeCalled-oletusta.
	*/
	it('should not be able to edit a movie if its name, director, release date or description is empty', function(){
		scope.movie.movieName = '';
		scope.movie.director = 'Uusi Muokattu ohjaaja';
		scope.movie.releaseYear = '3000';
		scope.movie.description = 'Uusi Muokattu kuvaus';

		scope.editMovie();
		scope.updateSite();

		expect(scope.movie).toEqual({
			id: '1234',
			movieName: 'Testi',
			director: 'Editor',
			releaseYear: '2015',
			description: 'Mahtava leffa!'
		});

		expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
		expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled();

		scope.movie.movieName = 'Uusi Muokatu Nimi';
		scope.movie.director = '';
		scope.movie.releaseYear = '3000';
		scope.movie.description = 'Uusi Muokattu kuvaus';

		scope.editMovie();
		scope.updateSite();

		expect(scope.movie).toEqual({
			id: '1234',
			movieName: 'Testi',
			director: 'Editor',
			releaseYear: '2015',
			description: 'Mahtava leffa!'
		});

		expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
		expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled();

		scope.movie.movieName = 'Uusi Muokattu Nimi';
		scope.movie.director = 'Uusi Muokattu ohjaaja';
		scope.movie.releaseYear = '';
		scope.movie.description = 'Uusi Muokattu kuvaus';

		scope.editMovie();
		scope.updateSite();

		expect(scope.movie).toEqual({
			id: '1234',
			movieName: 'Testi',
			director: 'Editor',
			releaseYear: '2015',
			description: 'Mahtava leffa!'
		});

		expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
		expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled();

		scope.movie.movieName = 'Uusi Muokattu Nimi';
		scope.movie.director = 'Uusi Muokattu ohjaaja';
		scope.movie.releaseYear = '3000';
		scope.movie.description = '';

		scope.editMovie();
		scope.updateSite();

		expect(scope.movie).toEqual({
			id: '1234',
			movieName: 'Testi',
			director: 'Editor',
			releaseYear: '2015',
			description: 'Mahtava leffa!'
		});

		expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
		expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled();
	});
});
