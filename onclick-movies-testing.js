const fetch = require("node-fetch");

function get_movies() {
    // Get movies in JSON
    try {
        var movies;
        fetch('http://www.omdbapi.com/?apikey=4f3f9ee&type=moviei=tt012176&6')
            .then(data=>{
                return data.json();
                })
            .then(res=>{
                console.log(res);
                movies = res;
            }) // res is the JSON response
        .catch(error=>console.log(error))

        setTimeout(function(){ 
            console.log(movies.Title)
            console.log(JSON.stringify(movies));
            
        }, 3000);
    }
    catch (err) {
        console.error(err);
    }
}



get_movies();
