const API_KEY = '571fd57e3fcdc8f231da2cf88585861b';
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch popular movies to populate main banner and carousels
function fetchPopularMovies() {
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            displayBanner(data.results[0]);
            displayCarousel('Popular', data.results);
        });
}

// Display a movie in the main banner
function displayBanner(movie) {
    const banner = document.getElementById('main-banner');
    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`;
}

// Fetch movies by genre to create carousels
function fetchCategory(genre) {
    const genreMap = {
        "Animation": 16,
        "Horror": 27,
        "Science Fiction": 878,
        "Action": 28
    };
    const genreId = genreMap[genre];

    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`)
        .then(response => response.json())
        .then(data => {
            clearMovies();
            displayCarousel(genre, data.results);
        });
}

// Display movies in a carousel by category or search
function displayCarousel(title, movies) {
    const categoriesSection = document.getElementById('categories');
    categoriesSection.innerHTML = `<h2>${title}</h2>`;
    
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        `;
        movieCard.addEventListener('click', () => showModal(movie));
        carousel.appendChild(movieCard);
    });

    categoriesSection.appendChild(carousel);
}

// Search movies by title
function searchMovies(event) {
    const query = event.target.value;

    if (query.length < 3) return; // Only search after 3 characters

    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(response => response.json())
        .then(data => {
            clearMovies();
            displaySearchResults(data.results);
        });
}

// Display search results
function displaySearchResults(movies) {
    const searchResults = document.getElementById('search-results');
    const searchMoviesDiv = document.getElementById('search-movies');
    
    searchResults.classList.remove('hidden');
    searchMoviesDiv.innerHTML = ''; // Clear previous search results

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        `;
        movieCard.addEventListener('click', () => showModal(movie));
        searchMoviesDiv.appendChild(movieCard);
    });
}

// Show a modal with movie details
function showModal(movie) {
    const modal = document.getElementById('movie-modal');
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-overview').textContent = movie.overview;
    document.getElementById('modal-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
}

// Clear movies from previous searches or category selections
function clearMovies() {
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('search-movies').innerHTML = '';
    document.getElementById('categories').innerHTML = '';
}

// Watch Later list handling
function addToWatchLater() {
    const movieTitle = document.getElementById('modal-title').textContent;
    const moviePoster = document.getElementById('modal-poster').src;

    let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    
    // Check if the movie is already in the Watch Later list
    if (!watchLater.some(movie => movie.title === movieTitle)) {
        watchLater.push({ title: movieTitle, poster: moviePoster });
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
        alert(`${movieTitle} added to Watch Later`);
    } else {
        alert(`${movieTitle} is already in your Watch Later list.`);
    }
}

// Function to display Watch Later items
function displayWatchLaterItems() {
    const watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    const watchLaterContainer = document.getElementById('watch-later-container');
    
    watchLaterContainer.innerHTML = ''; // Clear previous items

    watchLater.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('watch-later-item');
        itemElement.innerHTML = `
            <img src="${item.poster}" alt="${item.title}">
            <p>${item.title}</p>
            <button onclick="removeFromWatchLater('${item.title}')">Remove</button>
        `;
        watchLaterContainer.appendChild(itemElement);
    });
}

// Load Watch Later items on page load
window.onload = () => {
    fetchPopularMovies();
    displayWatchLaterItems(); // Show Watch Later items without sign-in
};

// Audio and toggle setup
const backgroundMusic = document.getElementById('background-music');
const toggleSoundButton = document.getElementById('toggle-sound');

// Play music on load
backgroundMusic.play();
toggleSoundButton.textContent = '🔊';  // Sound on icon

// Toggle sound function
function toggleSound() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        toggleSoundButton.textContent = '🔊';  // Sound on icon
    } else {
        backgroundMusic.pause();
        toggleSoundButton.textContent = '🔈';  // Sound off icon
    }
}

// Optional: Remove movie from Watch Later list
function removeFromWatchLater(movieTitle) {
    let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    watchLater = watchLater.filter(movie => movie.title !== movieTitle);
    localStorage.setItem('watchLater', JSON.stringify(watchLater));
    displayWatchLaterItems(); // Refresh the Watch Later list
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('movie-modal');
    modal.style.display = 'none'; // Hide the modal
}

// Optional: Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('movie-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
