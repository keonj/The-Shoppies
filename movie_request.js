const fetch = require("node-fetch");

// json movie fetch request
const searchMovies = async (searchString) => {
    try {
        const res = await fetch('http://www.omdbapi.com/?apikey=4f3f9ee&type=movie&s='+searchString);
        movies = await res.json();
        console.log(JSON.stringify(movies))

        // print movie info: title, year of release
        for (result in movies["Search"]) {
            // trim name
            var name = JSON.stringify(movies["Search"][result]["Title"]);
            name = name.substring(1,name.length-1);
            var year = JSON.stringify(movies["Search"][result]["Year"]);
            year = year.substring(1,year.length-1);

            console.log(name + ' (' + year + ')');
        }
    } catch (err) {
        console.error(err);
    }
}

searchMovies('incredible');