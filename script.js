let searchBtn = document.getElementById("btn-submit");
let searchInput = document.getElementById("search");
let results = document.getElementById("results");
let searchHeader = document.getElementById("searchheader");
let pagination = document.getElementById("pagination");
let totalPages = 0;

let searchValue = "";
let resultsPage = 1;

searchBtn.addEventListener("click", function () {
    searchValue = searchInput.value;

    // A new search, reset the page number
    resultsPage = 1;

    // perform search
    searchMovies(searchValue, resultsPage);
});

pagination.addEventListener("click", function (event) {
    event.preventDefault();
    let page = event.target.innerHTML;
    if (page == "Previous") {
        resultsPage--;
    } else if (page == "Next") {
        resultsPage++;
    } else {
        resultsPage = page;
    }

    if (resultsPage > 0 && resultsPage <= totalPages) {
        // perform search
        searchMovies(searchValue, resultsPage);
    }

});

function searchMovies(query, page) {
    // API endpoint construction
    let url = `https://www.omdbapi.com/?apikey=a8770646&s=${query}&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data);

            showPagination(data.totalResults);

            showSearchResults(data);
        });
}

function showPagination(numItems) {
    let paginationPages = ``;
    totalPages = Math.ceil(numItems / 10);

    // Iterate over the number of pages
    for (let i = 1; i <= totalPages; i++) {
        paginationPages += `<li class="page-item ${i == resultsPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
    }

    pagination.innerHTML = `
                <nav aria-label="Search results navigation">
                    <ul class="pagination">
                        <li class="page-item ${resultsPage == 1 ? 'disabled' : ''}"><a class="page-link" href="#">Previous</a></li>
                        ${paginationPages}
                        <li class="page-item ${resultsPage == totalPages ? 'disabled' : ''}"><a class="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
            `;
}

function showSearchResults(data) {
    //console.log(data);

    // Clear previous search results
    results.innerHTML = "";

    searchheader.innerHTML = `<h2>Search results for: ${searchValue}</h2>`;

    // iterate over the search results
    for (let i = 0; i < data.Search.length; i++) {
        results.innerHTML += `
                    <div class="card m-2">
                        <img src="${data.Search[i].Poster != "N/A" ? data.Search[i].Poster : ""}" class="card-img-top" alt="${data.Search[i].Title}">
                        <div class="card-body">
                            <h5 class="card-title">${data.Search[i].Title}</h5>
                            <p class="card-text">Released: ${data.Search[i].Year}</p>
                            <p class="card-text">Type: ${data.Search[i].Type}</p>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#movieModal" data-bs-movieid="${data.Search[i].imdbID}">Movie details</button>
                        </div>
                    </div>
                `;
    }
}

// Code for the modal movie details window
const movieModal = document.getElementById('movieModal');
if (movieModal) {
    movieModal.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget;

        // Extract info from data-bs-* attributes
        let imdbID = button.getAttribute('data-bs-movieid');

        // Retrieve movie details
        let url = "https://www.omdbapi.com/?apikey=a8770646&i=" + imdbID;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                //console.log(data);

                let modalTitle = document.getElementById("movieModalLabel");
                modalTitle.innerHTML = `Movie details: ${data.Title}`;

                let modalBody = document.getElementById("modalBody");
                modalBody.innerHTML = `
                            <p>Actors: ${data.Actors}</p>
                            <p>Director: ${data.Director}</p>
                            <p>Genre: ${data.Genre}</p>
                            <p>Plot: ${data.Plot}</p>
                            <p>Released: ${data.Released}</p>
                            <p>imdbRating: ${data.imdbRating}</p>
                            <img src="${data.Poster}" class="img-fluid w-100" alt="${data.Title}">
                        `;
            });

    })
}