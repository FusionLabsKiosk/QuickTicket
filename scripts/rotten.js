//Rotten Tomatoes API
var rotten = {};

rotten.getInTheatersData = function(callback) {
    window.addEventListener('message', function(e) {
        if (e.data.script === 'rotten') {
            rotten.parseMovieData(e.data.movies);
            if (callback !== undefined) {
                callback();
            }
        }
    });
    sandbox.message({
        'script': 'rotten'
    });
};

rotten.parseMovieData = function(movies) {
    data.movies = [];
    console.log('Got movies (' + movies.length + ') First: ' + movies[0].title);
    
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i];
        var movie = new Movie();
        movie.ID = m.id;
        movie.Title = m.title;
        movie.Rating = m.mpaa_rating;
        movie.Runtime = m.runtime + ' min';
        rotten.getMoviePoster(m, movie);
        movie.Synopsis = m.synopsis;
        for (var j = 0; j < m.abridged_cast.length; j++) {
            movie.Cast.push(m.abridged_cast[j].name);
        }
        //movie.Directors = m.directors.slice();
        data.movies.push(movie);
    }
};

rotten.getMoviePoster = function(data, movie) {
    rotten.getExternalImage(data.posters.original, function(src) {
        movie.PosterURL = src;
    });
};

rotten.getExternalImage = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        callback(window.URL.createObjectURL(xhr.response));
    };
    xhr.open('GET', url, true);
    xhr.send();
};