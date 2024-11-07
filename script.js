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

    // Show spinner while loading
    results.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    // API endpoint construction
    let url = `https://www.omdbapi.com/?apikey=a8770646&s=${query}&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data);

            if (data.Response == "False") {
                showPagination(0);
            } else {
                showPagination(data.totalResults);
            }

            showSearchResults(query, data);
        });
}

function showPagination(numItems) {

    let paginationPages = ``;

    pagination.innerHTML = ``;

    if (numItems == 0) {
        return;
    }

    totalPages = Math.ceil(numItems / 10);

    let maxPages = 10;

    let startPage = Math.max(1, resultsPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    // Iterate over the number of pages to show
    for (let i = startPage; i <= endPage; i++) {
        paginationPages += `<li class="page-item ${i == resultsPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
    }

    pagination.innerHTML = `
                <nav aria-label="Search results navigation">
                    <ul class="pagination justify-content-center flex-wrap">
                        <li class="page-item ${resultsPage == 1 ? 'disabled' : ''}"><a class="page-link" href="#">Previous</a></li>
                        ${paginationPages}
                        <li class="page-item ${resultsPage == totalPages ? 'disabled' : ''}"><a class="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
            `;
}

function showSearchResults(query, data) {
    //console.log(data);

    // Clear previous search results
    results.innerHTML = "";

    if (data.Response == "False") {
        searchheader.innerHTML = `<h2 class="text-white">No results found for: ${query}</h2>`;
        return;
    }

    searchheader.innerHTML = `<h2 class="text-white">Search results for: ${query} (${data.totalResults} result)</h2>`;

    // iterate over the search results
    for (let i = 0; i < data.Search.length; i++) {
        results.innerHTML += `
                    <div class="card m-2 bg-dark-subtle">
                        <img src="${data.Search[i].Poster != "N/A" ? data.Search[i].Poster : "placeholder.gif"}" class="card-img-top" alt="${data.Search[i].Title}">
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

        // Show spinner while loading
        let modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            `;

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
                            <img src="${data.Poster != "N/A" ? data.Poster : "placeholder.gif"}" class="img-fluid w-100" alt="${data.Title}">
                        `;
            });

    })
}