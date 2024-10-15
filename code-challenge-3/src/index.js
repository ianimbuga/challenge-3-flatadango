// Your code here
document.addEventListener("DOMContentLoaded", () => {
    let currentMovieId;
    let currentTicketsSold;
    let currentCapacity;
  
    // Function to fetch movie details
    function getMovieDetails() {
        fetch('http://localhost:3000/films/1') 
            .then(response => response.json())
            .then(movie => {
                currentMovieId = movie.id; 
                currentTicketsSold = movie.tickets_sold; 
                currentCapacity = movie.capacity; 
                updateMovieDetails(movie); 
            })
            .catch(error => console.error('Error fetching movie details:', error));

            document.querySelector('#buy-ticket').addEventListener('click', () => {
                const ticketsAvailable = document.querySelector('#ticket-num');
                let currentTickets = parseInt(ticketsAvailable.textContent);
                
                if (currentTickets > 0) {
                  currentTickets -= 1;
                  ticketsAvailable.textContent = currentTickets;
              
                  
                  const filmId = 1; // Use the correct film ID for the currently displayed film
                  fetch`(http://localhost:3000/films/${filmId}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      tickets_sold: parseInt(ticketsAvailable.textContent)
                    })
                  };
                } else {
                  document.querySelector('#buy-ticket').textContent = 'Sold Out';
                }
              });
    }
  
    // Function to update movie details in the DOM
    function updateMovieDetails(movie) {
        const availableTickets = movie.capacity - movie.tickets_sold;
  
        // Updating the DOM with movie details
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-runtime').textContent = movie.runtime;
        document.getElementById('movie-showtime').textContent = movie.showtime;
        document.getElementById('movie-tickets').textContent = availableTickets;
        document.getElementById('film-info').textContent = movie.description;
        document.getElementById('movie-poster').src = movie.poster;
  
        // Adding event listener for the  button
        const buyButton = document.getElementById("buy-ticket");
        buyButton.onclick = () => {
            if (availableTickets > 0) {
                updateTicketsSold(currentMovieId, currentTicketsSold + 1);
            } else {
                alert('No tickets available for this movie.');
            }
        };
    }
  
    // Function to fetch all movies and populate the menu
    function getAllMovies() {
        fetch('http://localhost:3000/films')  
            .then(response => response.json())
            .then(movies => {
                const filmsList = document.getElementById('films');
                filmsList.innerHTML = '';
  
                
                movies.forEach(movie => {
                    const li = document.createElement('li');
                    li.classList.add('film', 'item');
                    li.textContent = movie.title;
  
                    
                    li.addEventListener('click', () => displayMovieDetails(movie));
  
                    
                    filmsList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching movies:', error));
    }
  
    // Function to display movie details in the movie-details section
    function displayMovieDetails(movie) {
        currentMovieId = movie.id; 
        currentTicketsSold = movie.tickets_sold; 
        currentCapacity = movie.capacity; 
        updateMovieDetails(movie); 
    }
  
    // Function to update tickets sold on the server
    function updateTicketsSold(movieId, newTicketsSold) {
        fetch`(http://localhost:3000/films/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: newTicketsSold,
            }),
        }
        .then(response => response.json())
        .then(updatedMovie => {
            // Updating UI after ticket purchase
            currentTicketsSold = updatedMovie.tickets_sold; 
            const availableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
            document.getElementById('movie-tickets').textContent = availableTickets;
  
            
            document.getElementById('buy-ticket').disabled = availableTickets <= 0;
  
            if (availableTickets <= 0) {
                alert('Tickets sold out!');
            } else {
                alert('Ticket purchased successfully!');
            }
        })
        .catch(error => console.error('Error updating tickets sold:', error));
    }
  
    
    getAllMovies();
    
    getMovieDetails();
  });