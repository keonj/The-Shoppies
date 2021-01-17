// ------------------------------SEARCH COMPONENT---------------------------------------
const searchBar = document.getElementById("searchBar");

// Takes input from search bar; makes OMDB API request and adds movie list to results container
function get_movies(searchString) {
    // Update result search string
    document.getElementById("results").innerHTML = 'Results for "' + searchString + '"';

    // Get movies in JSON
    try {
        var movies;
        fetch('https://www.omdbapi.com/?apikey=4f3f9ee&type=movie&s='+searchString)
            .then(data=>{
                return data.json();
                })
            .then(res=>{
                console.log(res);
                movies = res;
            }) // res is the JSON response
        .catch(error=>console.log(error))

        setTimeout(function(){ 
            movies = movies["Search"];
            console.log(JSON.stringify(movies));

            // Add movies to list
            add_movie_list(movies);
        }, 2000);
    }
    catch (err) {
        console.error(err);
    }
}

// Takes input as JSON-format list of movies; adds movies as list items in results container 
function add_movie_list(movies) {
    var movieList = document.getElementById('movieList');

    while(movieList.firstChild) movieList.removeChild(movieList.firstChild);

    // Create set of already nominated movies
    const list_items = document.getElementsByName("nomination");
    var nominated_id = new Set();
    for (i=0;i<list_items.length;i++) {
        nominated_id.add(list_items[i].id);
        console.log(nominated_id[i]);
    }

    movies.forEach(function(movie) {
        var li = document.createElement("li");
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("Nominate"));
        button.id = movie.imdbID;

        // button.onclick = function () { searchIDNomination(movie.imbdID);};
        // button.setAttribute("onclick", "javascript: searchIDNomination('" + movie.imdbID + "');");
        button.setAttribute("onclick", "javascript: add_nomination('" + movie.Title + "', '" + movie.Year + "', '" + movie.imdbID + "');");
        
        // Bootstrap
        li.setAttribute("class", "list-group-item");
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-light btn-sm btn-outline-secondary");

        li.appendChild(document.createTextNode(movie.Title + ' (' + movie.Year + ')  '));
        li.appendChild(button);
        
        console.log(button.id);
        movieList.appendChild(li);

        // If imdbID is in nominated set, then disable button
        if (nominated_id.has(movie.imdbID)) disable_button_generated(button);
    });
}
// -------------------------------------------------END SEARCH COMPONENT----------------------------------------------------

//--------------------------------------------------NOMINATION COMPONENT--------------------------------------------

// Add movie to nomination list
function add_nomination(title, year, id) {
    var nominationList = document.getElementById("nominationList");

    // disable selected nomination
    disable_button(id);

    var li = document.createElement("li");
    var button = document.createElement("button");
    button.appendChild(document.createTextNode("Remove"));
    button.setAttribute("onclick", "javascript: remove_nomination_list('" + id + "');");

    // Bootstrap
    li.setAttribute("class", "list-group-item");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-light btn-sm btn-outline-secondary");

    console.log(id);

    li.appendChild(document.createTextNode(title + ' (' + year + ')  '));
    li.id = id;
    li.setAttribute("name", "nomination");
    li.appendChild(button);

    nominationList.appendChild(li);

    // add banner if nomination list has 5 children
    const list_items = document.getElementsByName("nomination");
    const list_size = list_items.length;
    if (list_size == 5) {
        unhide_banner();
    };

    // Update client-side storage for nominated id
    set_id_storage();
}

//------------------------------------------------------END NOMINATION COMPONENT---------------------------------------------------

//------------------------------------------------------REMOVE COMPONENT---------------------------------------------------------

// Takes in id of movie to be removed; removes movie from nomination list
function remove_nomination_list(id) {
    const list_items = document.getElementsByName("nomination");
    document.getElem
    console.log(list_items);
    for (i=0;i<list_items.length;i++) {
        if (list_items[i].id == id) list_items[i].remove();
        console.log(list_items[i]);
    }

    // Enable the button for removed movie
    try {
        enable_button(id);
    }
    catch (err) {
        console.log(err);
    }

    // Remove banner if nominations < 5
    const list_size = list_items.length;
    if (list_size < 5) {
        hide_banner();
    };

    // Update client-side storage for nominated id
    set_id_storage();
}

//---------------------------------------------------END REMOVE COMPONENT-------------------------------------------------------

//---------------------------------------------------BUTTON DISABLE FOR NOMINATION COMPONENT--------------------------------------

// Disables a current button [when movie is nominated]
function disable_button(id) {
    var nominatedButton = document.getElementById(id);
    nominatedButton.disabled = true;
}

// Enables a current button [when movie is removed]
function enable_button(id) {
    var enabledButton = document.getElementById(id);
    enabledButton.disabled = false;
}

// Disables buttons when being implemented [disables buttons for movies already nominated in result generation]
function disable_button_generated(button) {
    button.disabled = true;
}

//---------------------------------------------END BUTTON DISABLE FOR NOMINATION COMPONENT--------------------------------------

//---------------------------------------------DISPLAY BANNER--------------------------------------------------------------

// Unhides banner
function unhide_banner() {
    var banner = document.getElementById("banner");
    banner.style.display = 'block';
    console.log("Reached five");
}

// Hides banner
function hide_banner() {
    var banner = document.getElementById("banner");
    banner.style.display = 'none';
    console.log("Below five");
}

//-------------------------------------------------END DISPLAY BANNER-------------------------------------------------------------

//----------------------------------------EXTRA: CLIENT-SIDE DATA STORAGE (SAVING)-----------------------------------------------

// Set nominated movie id to storage
function set_id_storage() {
    // Get list of nominated movie IDs
    var id = [];
    const list_items = document.getElementsByName("nomination");
    console.log(list_items);
    for (i=0;i<list_items.length;i++) {
        id[i] = list_items[i].id;
    }
    console.log(JSON.stringify(id));
    // Store movie IDs in local storage
    localStorage.setItem("nominated_id", JSON.stringify(id));
    console.log(localStorage.getItem("nominated_id"));
}

// Return nominated movie id from storage
function get_id_storage() {
    var nominated_id = JSON.parse(localStorage.getItem("nominated_id"));
    for(id in nominated_id) {
        console.log(nominated_id[id]);
    }
    return nominated_id;
}

// Initialize new web page with client's saved nomination list
function initialize_nomination_list() {
    var nominated_id = get_id_storage();

    for(var id in nominated_id) {
        searchIDNomination(nominated_id[id]);
    }
}

//--------------------------------------------------------------------------------------------------------------------------------
// Takes in a movie id; makes an API request for movie data and adds the movie to the nomination list
function searchIDNomination(id) {
    // API call for movie information
    try {
        var movie;
        fetch('http://www.omdbapi.com/?apikey=4f3f9ee&type=movie&i='+id)
            .then(data=>{
                return data.json();
                })
            .then(res=>{
                console.log(res);
                movie = res;
            }) // res is the JSON response
        .catch(error=>console.log(error))

        setTimeout(function(){ 
            console.log(JSON.stringify(movie));

            // Add movies to list
            add_nomination_list(movie);
        }, 2000);
    }
    catch (err) {
        console.error(err);
    }
}

// Add a nomination based on its imdb id
function add_nomination_list(movie) {
    var nominationList = document.getElementById("nominationList");

    // disable selected nomination

    var li = document.createElement("li");
    var button = document.createElement("button");
    button.appendChild(document.createTextNode("Remove"));
    button.setAttribute("onclick", "javascript: remove_nomination_list('" + movie.imdbID + "');");

    // Bootstrap button
    li.setAttribute("class", "list-group-item");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-light btn-sm btn-outline-secondary");
        
    console.log(movie.imdbID);

    li.appendChild(document.createTextNode(movie.Title + ' (' + movie.Year + ')  '));
    li.id = movie.imdbID;
    li.setAttribute("name", "nomination");
    li.appendChild(button);

    nominationList.appendChild(li);

    // add banner if nomination list has 5 children
    const list_items = document.getElementsByName("nomination");
    console.log("hello there")
    const list_size = list_items.length;
    if (list_size >= 5) {
        unhide_banner();
    }
    else {
        hide_banner();
    }
}

//-----------------------------------------END EXTRA: CLIENT-SIDE DATA STORAGE (SAVING)-----------------------------------------

//---------------------------------------------SHAREABLE LINKS------------------------------------------------------------------

// get url hash and log it on console
function get_id_from_hash() {
    var hash = window.location.hash.substring(1,window.location.hash.length);

    console.log(hash);

    var id = hash.split("/");
    console.log(id); 

    // set storage to shared id
    localStorage.setItem("nominated_id", JSON.stringify(id));

    // re-initialize web page for new storage id
    initialize_nomination_list();
}

// read from url, set the nominate id (if not empty), initialize
function initialize_page_with_hash() {
    if (window.location.hash) {
        get_id_from_hash();
    }
    else {
        initialize_nomination_list();
    }
}

// url constructor and/or copy function
function copy_shareable_link() {
    // Get text for copy
    var raw_url = window.location.href;
    var hash = window.location.hash;
    var index_of_hash = raw_url.indexOf(hash) || raw_url.length
    var shareable_url = raw_url.substr(0, index_of_hash) + "#";
    const nomination_id = get_id_storage();
    for (id in nomination_id) {
        shareable_url += nomination_id[id] + "/";
    }
    shareable_url = shareable_url.substring(0, shareable_url.length-1);

    // Copy function for url
    console.log(shareable_url);
    navigator.clipboard.writeText(shareable_url);

    link.innerHTML = "Updated Shareable URL: " + shareable_url;
}

//------------------------------------------------------END SHAREABLE LINKS-----------------------------------------------------



// Initialize web page for previous nomination list
//document.onload = initialize_nomination_list()
//document.onload = get_id_from_hash();
document.onload = initialize_page_with_hash();

// Update search results
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    get_movies(searchString);
});