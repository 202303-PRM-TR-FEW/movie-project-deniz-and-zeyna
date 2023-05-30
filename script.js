'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".containers");
const GENREDD = document.getElementById("genredd");
const moviegenre = document.getElementById("moviegenre");
const about = document.getElementById("about");
about.addEventListener("click", () => {
  CONTAINER.innerHTML = ` <div class=" mx-5 my-5 px-5 py-5 ">

  <div class="card-body fw-normal fst-italic fs-5 text">
    
    <p class="card-text"> Welcome to the CHILL! </p>
    <p> We are your one-stop destination for all things movies. We have a vast library of movies, including new releases, classic films, and everything in between. We also have a comprehensive database of actors and actresses, so you can learn more about your favorite stars. </p>
    <p class="card-text"> Our website is easy to use and navigate. You can search for movies by title, actor, genre, or release date. You can also browse our collection by popular movies, top rated movies, now playing movies, and upcoming movies. </p>

  </div>`

});

// Don't touch this function please
const autorun = async () => {

  const movies = await fetchMovies();
  const trailermovie = await fetchTrailer();
  const trailerKey = await fetchTrailerKey(trailermovie);
  renderMovies(movies.results, trailermovie, trailerKey);
  const gen = await fetchGenre();
  renderGenre(gen.genres);
  setupFilterDropdown();

};


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=69a9422c12ba57938ae24e90e3fc9cdf`;
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
const fetchTrailer = async () => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=69a9422c12ba57938ae24e90e3fc9cdf`);
  const data = await response.json();

  // Select a random movie from the list
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const movie = data.results[randomIndex];

  return movie;
}
const fetchTrailerKey = async (movie) => {
  console.log(movie)
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=69a9422c12ba57938ae24e90e3fc9cdf`);
  const data = await response.json();

  // Check if there are any videos available
  if (data.results && data.results.length > 0) {
    // Find the first trailer in the list
    const trailer = data.results.find(video => video.type === 'Trailer');

    if (trailer) {
      return trailer.key;
    }
  }

  // Return null if no trailer key is found
  return null;

}
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
const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
const fetchKnownFor = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url);
  const data = await res.json();
  return data.cast;
}
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url)
  const data = await res.json();
  return data.results;
}
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
  } else if (filtervalue == "release_date") {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=69a9422c12ba57938ae24e90e3fc9cdf&sort_by=release_date.desc`);
    const data = await res.json();
    return data;
  } else if (filtervalue == "top_rated") {
    const url = constructUrl(`movie/top_rated`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } else if (filtervalue == "now_playing") {
    return await fetchMovies()
  } else if (filtervalue == "upcoming") {
    const url = constructUrl(`movie/upcoming`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
}
const renderActors = (actors) => {
  CONTAINER.innerHTML = ""
  const actorsDiv = document.createElement("div");
  actorsDiv.setAttribute("class", "moviesDiv");
  CONTAINER.appendChild(actorsDiv);

  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.setAttribute("class", "movieDiv");
    actorDiv.innerHTML = `
     <img class="movieImage  " src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${actor.name} poster">
     <h5>${actor.name}</h5>
     `;

    actorDiv.addEventListener("click", () => {
      renderActor(actor);
    });
    actorsDiv.appendChild(actorDiv);
  })
}
// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies, trailerMovie, trailerKey) => {
  CONTAINER.innerHTML = ""

  const posterContainer = document.createElement('div');
  posterContainer.classList.add('d-flex', 'poster-container', 'justify-content-center', 'align-items-center')
  CONTAINER.appendChild(posterContainer)

  posterContainer.setAttribute('style', `background-image:url("${BACKDROP_BASE_URL + trailerMovie.backdrop_path}"); `)
  const vidSec = document.createElement('div');
  vidSec.setAttribute('id', 'vidSec')
  CONTAINER.appendChild(vidSec)
  const trailerButton = document.createElement('button');
  trailerButton.classList.add('trailer-btn', 'btn', 'btn-warning', 'btn-lg', 'rounded-pill');
  trailerButton.textContent = 'Watch Trailer';
  trailerButton.addEventListener('click', function () {
    vidSec.innerHTML = `  <div class="d-flex justify-content-center align-items-center">
    <div id="videoSection" class="embed-responsive embed-responsive-16by9 " style="display: none; width: 70%;">
      <iframe id="videoPlayer" class="embed-responsive-item" src="" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </div>
  </div>  `

    renderVideo(trailerKey);
  });

  posterContainer.appendChild(trailerButton);

  const moviesDiv = document.createElement("div");
  moviesDiv.setAttribute("class", "moviesDiv ");
  CONTAINER.appendChild(moviesDiv);

  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute("class", "movieDiv");
    movieDiv.innerHTML = `
     <img class="movieImage " src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
     <h5>${movie.title}</h5>
     `;

    movieDiv.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      movieDetails(movie);
    });

    posterContainer.appendChild(trailerButton);
    moviesDiv.appendChild(movieDiv);
  })
};


const renderGenre = async (genres) => {
  genres.map((genre) => {
    const genreli = document.createElement('li');
    genreli.setAttribute("class", "dropdown-item ");
    genreli.innerHTML = `${genre.name}`
    genreli.addEventListener("click", async () => {
      const moviebygenre = await fetchMoviesByGenre(genre.id)
      const trailer = await fetchTrailer();
      const trailerkey = await fetchTrailerKey(trailer)
      renderMovies(moviebygenre.results, trailer, trailerkey);
    });
    GENREDD.appendChild(genreli)

  })

};

const renderCast = (cast) => {

  const castDiv = document.querySelector(".cast");
  cast.slice(0, 5).map((actor) => {
    const actorli = document.createElement("li");
    actorli.setAttribute("class", "actorli");
    actorli.innerHTML = ` <div class="actorsCards"><img class="rounded actorimg" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.name} poster"><p class="info pt-4" id="actorsNames">${actor.name}</p></div>`;
    actorli.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderActor(actor, cast);
    });
    castDiv.appendChild(actorli);
  });
};
const renderKnownFor = (knownfors) => {
  const castDiv = document.querySelector(".known-for");
  knownfors.slice(0, 5).map((knownfor) => {
    const actorli = document.createElement("li");
    actorli.setAttribute("class", "actorli");
    actorli.innerHTML = ` <div class="actorsCards"><img class="rounded actorimg" src="${PROFILE_BASE_URL + knownfor.poster_path}" alt="${knownfor.title} poster"><p class="info pt-4" id="actorsNames">${knownfor.title}</p></div>`;
    actorli.addEventListener('click', async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchMovie(knownfor.id)
      movieDetails(knownfor);
    });
    castDiv.appendChild(actorli);
  });
}
// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = async (movie, cast) => {

  CONTAINER.innerHTML = `
  <div class = "movieDetails" style = "background-image:url('${BACKDROP_BASE_URL + movie.poster_path}');">
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
            <div class ="trailerbtn"></div>
        </div>
    </div>
  </div>
  <div class="mt-5 d-flex justify-content-center align-items-center">
    <div id="videoSection" class = "embed-responsive embed-responsive-16by9 "style="display: none; width: 70%;">
      <iframe id="videoPlayer"  class="embed-responsive-item" src="" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </div>
  </div>
  <div class ="mt-5 pt-5 mx-5 px-2">  
    <h3 class ="px-5">Cast:</h3>
    <ul id="actors" class="cast"></ul>
  </div>
  `;
  const trailerbtnDiv = document.querySelector(".trailerbtn")

  const trailerBtn = document.createElement('button');
  const trKey = await fetchTrailerKey(movie)
  trailerBtn.classList.add('btn', 'btn-warning', 'btn-lg', 'rounded-pill');
  trailerBtn.textContent = 'Watch Trailer';
  trailerBtn.addEventListener('click', function () {
    renderVideo(trKey);
  });
  trailerbtnDiv.appendChild(trailerBtn);

  renderCast(cast);
};
const renderVideo = (key) => {
  const videoSection = document.getElementById('videoSection');
  const videoPlayer = document.getElementById('videoPlayer');
  videoSection.style.display = 'block';
  videoPlayer.src = `https://www.youtube.com/embed/${key}`;
  const windowHeight = window.innerHeight;
  const videoHeight = videoSection.offsetHeight;
  const offsetTop = videoSection.offsetTop + (videoHeight / 2) - (windowHeight / 2);

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth"
  });
}
const renderActor = async (actor, cast) => {
  const actorprivateDetail = await fetchActor(actor.id);
  const knowforDetails = await fetchKnownFor(actor.id)
  const actorDetail = actor;
  CONTAINER.innerHTML = `
  <div class="movieDetails mt-0">
        <div class="row mx-3">
            <div class="col-md-4">
                <img id="movie-backdrop" src=${BACKDROP_BASE_URL + actorDetail.profile_path}>
            </div>
            <div class="col-md-8 mt-5">
                <h2 id="actorDetail-title">${actorDetail.name}</h2>
                <p id="actorDetail-release-date"><b>Birthday:</b> ${actorprivateDetail.birthday}</p>
                <p id="actorDetail-runtime"><b>Place of Birth:</b> ${actorprivateDetail.place_of_birth}</p>
                <p id="actorDetail-popularity"><b>Popularity:</b> ${actorprivateDetail.popularity}</p>



            </div>
        </div>
    </div>
    <div class="mt-3 px-5 biography">
        <h3>Biography:</h3>
        <p id="actorDetail-overview" class = "pt-2 pr-5 text-justify">${actorprivateDetail.biography}</p>
    </div>
    <div class="mt-3 px-5 hv-100">
        <h3 class="mt-5">Known for:</h3>
        <div class="known-for d-flex justify-content-between">
        </div>
    </div>

  
  `
  renderKnownFor(knowforDetails, cast)
}

var form = document.querySelector('.search-input');
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  var input = document.querySelector('.form-control');
  var searchQuery = input.value;
  input.value = ''
  const moviesbysearch = await fetchMoviesBysearch(searchQuery);
  const trailer = await fetchTrailer();
  const trailerkey = await fetchTrailerKey(trailer);
  renderMovies(moviesbysearch.results, trailer, trailerkey);

});

function setupFilterDropdown() {
  var filterOptions = document.getElementsByClassName('filter');

  for (var i = 0; i < filterOptions.length; i++) {
    filterOptions[i].addEventListener('click', async function (event) {
      event.preventDefault();

      var selectedFilter = this.dataset.filter;

      // Perform your desired action with the selected filter
      console.log('Selected filter:', selectedFilter);
      const trailer = await fetchTrailer();
      const trailerkey = await fetchTrailerKey(trailer);
      const filterMovies = await fetchMoviesByFilter(selectedFilter);
      renderMovies(filterMovies.results, trailer, trailerkey);
    });
  }
}

const actorsli = document.getElementById("actorsli");
actorsli.addEventListener('click', async function () {

  const actors = await fetchActors();
  console.log(actors)
  renderActors(actors)
})

document.addEventListener("DOMContentLoaded", autorun);