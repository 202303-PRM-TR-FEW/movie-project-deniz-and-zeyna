'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const GENREDD = document.getElementById("genredd");
const moviegenre = document.getElementById("moviegenre");
const about = document.getElementById("about");
about.addEventListener("click", () => {
  CONTAINER.innerHTML = "<h1> this page is about movies</h1><p> we show you movies </p>"

});

// Don't touch this function please
const autorun = async () => {

  const movies = await fetchMovies();
  renderMovies(movies.results);
  const gen = await fetchGenre();
  renderGenre(gen.genres)

};


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${'69a9422c12ba57938ae24e90e3fc9cdf'}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const castRes = await fetchCast(movie.id);

  renderMovie(movieRes, castRes);


};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};
const fetchGenre = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
const fetchCast = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  return data.cast;
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};
const fetchMoviesByGenre = async (genreId) => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=69a9422c12ba57938ae24e90e3fc9cdf&with_genres=${genreId}`);
  const data = await res.json();
  return data;
};
// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ""
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute("class", "movieDiv");
    movieDiv.innerHTML = `
     <img class="movieImage" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
     <h3>${movie.title}</h3>
     `;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  })
};

const renderGenre = async (genres) => {
  genres.map((genre) => {
    const genreli = document.createElement('li');
    genreli.innerHTML = genre.name;
    genreli.addEventListener("click", async () => {
      const moviebygenre = await fetchMoviesByGenre(genre.id)
      renderMovies(moviebygenre.results);
    });
    GENREDD.appendChild(genreli)

  })

};

const renderCast = (cast) => {
  const castDiv = document.querySelector(".cast");
  cast.map((actor) => {
    const actorli = document.createElement("li");
    actorli.setAttribute("class", "actorli");
    actorli.innerHTML = ` <img class="actorsImages" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.name} poster"><div class="actorsCards"><p class="info" id="actorsNames">${actor.name}</p></div>`;

    castDiv.appendChild(actorli);
  });
};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, cast) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
    </div>
    <h3>Actors:</h3>
    <ul id="actors" class="cast"></ul>
  `;

  renderCast(cast);
};


document.addEventListener("DOMContentLoaded", autorun);
