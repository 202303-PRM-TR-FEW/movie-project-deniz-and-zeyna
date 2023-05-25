'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const GENREDD = document.getElementById("genredd");
const moviegenre = document.getElementById("moviegenre");

const about = document.getElementById("about");
about.addEventListener("click", () => {

  CONTAINER.innerHTML = `
  <div class="card mx-5 my-5 px-5 py-5 text-bg-secondary ">


  <div class="card-body fw-normal fst-italic fs-5 text">
    
    <p class="card-text"> Welcome to the CHILL! </p>
    <p> We are your one-stop destination for all things movies. We have a vast library of movies, including new releases, classic films, and everything in between. We also have a comprehensive database of actors and actresses, so you can learn more about your favorite stars. </p>
    <p class="card-text"> Our website is easy to use and navigate. You can search for movies by title, actor, genre, or release date. You can also browse our collection by popular movies, top rated movies, now playing movies, and upcoming movies. </p>


  </div>
`
})



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
const fetchMoviesBysearch = async (searchInput) => {
  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=69a9422c12ba57938ae24e90e3fc9cdf&query=${searchInput}`);
  const data = await res.json();
  return data;
};
const fetchMoviesByFilter = async (filtervalue) => {
  if (filtervalue == "popular") {
    const url = constructUrl(`movie/popular`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
  else if (filtervalue == "release_date") {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=69a9422c12ba57938ae24e90e3fc9cdf&sort_by=release_date.desc`);
    const data = await res.json();
    return data;
  }
  else if (filtervalue == "top_rated") {
    const url = constructUrl(`movie/top_rated`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
  else if (filtervalue == "now_playing") {
    return await fetchMovies()
  }
  else if (filtervalue == "upcoming") {
    const url = constructUrl(`movie/upcoming`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
}
// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ""
  const moviesDiv = document.createElement("div");
  moviesDiv.setAttribute("class", "moviesDiv");
  CONTAINER.appendChild(moviesDiv);

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
    moviesDiv.appendChild(movieDiv);
  })
};

const renderGenre = async (genres) => {
  genres.map((genre) => {
    const genreli = document.createElement('li');
    genreli.setAttribute("class", "genreli");
    genreli.innerHTML = `${genre.name}`
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

var form = document.querySelector('.search-input');
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  var input = document.querySelector('.form-control');
  var searchQuery = input.value;
  input.value = ''
  const moviesbysearch = await fetchMoviesBysearch(searchQuery)
  renderMovies(moviesbysearch.results);

});
var filterSelect = document.getElementById('filter-select');

filterSelect.addEventListener('change', async function () {
  var selectedFilter = filterSelect.value;

  const filterMovies = await fetchMoviesByFilter(selectedFilter);
  renderMovies(filterMovies.results)
});

document.addEventListener("DOMContentLoaded", autorun);
