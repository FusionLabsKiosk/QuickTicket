//data.js namespace
var data = {};

//Static Global Data Variables
data.CINEMA_NAME = 'I/0 Cinema 10';
data.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

data.ticketTypes = [];
data.pricings = [];
data.theaters = [];
data.movies = [];
data.showings = [];

data.initializeData = function() {
    $.getJSON('scripts/data.json', data.initializeDataJson);
    rotten.getInTheatersData(function() {
        data.generateShowtimes();
    });
};

data.generateShowtimes = function() {
    data.showings = [];
    var now = new Date();
    var date = data.MONTHS[now.getMonth()] + ' ' + now.getDate();
    
    var times = [
        '10:00am',
        '11:25am',
        '12:00pm',
        '12:30pm',
        '1:30pm',
        '2:00pm',
        '4:45pm',
        '6:20pm'
    ];
    var numShowings = 5;
    
    for (var i = 0; i < data.movies.length; i++) {
        var timeIndex = Math.floor((Math.random() * 3));
        
        for (var j = 0; j < numShowings; j++) {
            if (timeIndex < times.length) {
                var time = times[timeIndex];
                timeIndex += 2;
                
                var id = Math.floor((Math.random() * 9999) + 1000);
                var movie = data.movies[i];            
                var theater = data.theaters[Math.floor(Math.random() * data.theaters.length)];
                var showing = new Showing(id, movie, date, time, theater);
                data.showings.push(showing);
            }
        }
    }
};



data.initializeDataJson = function(json) {
    for (var i = 0; i < json.ticketTypes.length; i++) {
        var tt = json.ticketTypes[i];
        data.ticketTypes.push(new TicketType(tt.id, tt.name));
    }
    for (var i = 0; i < json.pricings.length; i++) {
        var p = json.pricings[i];
        var pricing = new Pricing(p.id, p.name);
        for (var j = 0; j < p.tickets.length; j++) {
            pricing.tickets.push(new Ticket(data.getTicketTypeByID(p.tickets[j].id), p.tickets[j].price));
        }
        data.pricings.push(pricing);
    }
    for (var i = 0; i < json.theaters.length; i++) {
        var t = json.theaters[i];
        data.theaters.push(new Theater(t.id, t.name, data.getPricingByName(t.pricing)));
    }
    for (var i = 0; i < json.movies.length; i++) {
        var m = json.movies[i];
        var movie = new Movie();
        movie.id = m.id;
        movie.title = m.title;
        movie.rating = m.rating;
        movie.runtime = m.runtime;
        movie.posterUrl = m.posterUrl;
        movie.posterUrl = m.synopsis;
        movie.cast = m.cast.slice();
        movie.directors = m.directors.slice();
        data.movies.push(movie);
    }
    for (var i = 0; i < json.showings.length; i++) {
        var s = json.showings[i];
        data.showings.push(new Showing(s.id, data.getMovieByTitle(s.movieTitle), s.date, s.time, data.getTheaterByID(s.theater)));
    }
    return;
};

//Helper Functions
data.getTicketTypeByID = function(id) {
    return data.getObjectByProperty(data.ticketTypes, 'id', id);
};
data.getPricingByName = function(name) {
    return data.getObjectByProperty(data.pricings, 'name', name); 
};
data.getMovieByID = function(id) {
    return data.getObjectByProperty(data.movies, 'id', id);
};
data.getMovieByTitle = function(name) {
    return data.getObjectByProperty(data.movies, 'title', name); 
};
data.getTheaterByID = function(id) {
    return data.getObjectByProperty(data.theaters, 'id', id);
};
data.getShowingByID = function(id) {
    return data.getObjectByProperty(data.showings, 'id', id);
};
data.getShowingsByMovie = function(movie) {
    return data.getArrayByProperty(data.showings, 'movie', movie); 
};
//This function will only return a the first found object, or undefined
data.getObjectByProperty = function(array, property, value) {
    var results = data.getArrayByProperty(array, property, value);
    if (results.length >= 1) {
        return results[0];
    }
};
//This function returns an array of results, which may be empty
data.getArrayByProperty = function(array, property, value) {
    var results = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i][property] == value) {
            results.push(array[i]);
        }
    }
    return results;
};