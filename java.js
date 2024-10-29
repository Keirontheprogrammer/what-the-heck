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
    let watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];
    if (!watchLater.includes(title)) {
        watchLater.push(title);
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
        alert(`${title} added to Watch Later`);
    }
}

window.onload = () => {
    fetchPopularMovies();
};


// Audio and toggle setup
const backgroundMusic = document.getElementById('background-music');
const toggleSoundButton = document.getElementById('toggle-sound');

// Play music on load
window.onload = () => {
    fetchPopularMovies();
    backgroundMusic.play();
    toggleSoundButton.textContent = '🔊';  // Sound on icon
};

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

const watchLater = JSON.parse(localStorage.getItem('watchLater')) || [];

// Function to add movie to Watch Later list
function addToWatchLater() {
    const movieTitle = document.getElementById('modal-title').textContent;
    
    if (!watchLater.some(movie => movie.title === movieTitle)) {
        watchLater.push({ title: movieTitle });
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
        alert(`${movieTitle} added to Watch Later`);
    } else {
        alert(`${movieTitle} is already in your Watch Later list.`);
    }
}

// Close modal function
function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
}


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
function addToWatchLater(movie) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in to add movies to your Watch Later list.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === currentUser.username);

    if (!users[userIndex].watchLater.some(watchMovie => watchMovie.title === movie.title)) {
        users[userIndex].watchLater.push(movie);
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex])); // Update currentUser
        alert(`${movie.title} added to Watch Later`);
    } else {
        alert(`${movie.title} is already in your Watch Later list.`);
    }
}

// Toggle between Sign In and Sign Up forms with smooth transition
function toggleAuthForms() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    signInForm.classList.toggle('hidden');
    signUpForm.classList.toggle('hidden');
}

// Dummy sign-in function
function signIn() {
    const username = document.getElementById('signInUsername').value;
    sessionStorage.setItem('currentUser', JSON.stringify({ username }));
    alert(`Welcome back, ${username}!`);
    window.location.href = 'index.html';
}

// Dummy sign-up function
function signUp() {
    const username = document.getElementById('signUpUsername').value;
    sessionStorage.setItem('currentUser', JSON.stringify({ username }));
    alert(`Account created! Welcome, ${username}`);
    window.location.href = 'index.html';
}
