//data.js namespace
var data = {};

//Static Global Data Variables
data.CINEMA_NAME = 'I/0 Cinema 10';

data.ticketTypes = [];
data.pricings = [];
data.theaters = [];
data.movies = [];
data.showings = [];

data.initializeDataJson = function(json) {
    for (var i = 0; i < json.ticketTypes.length; i++) {
        var tt = json.ticketTypes[i];
        data.ticketTypes.push(new TicketType(tt.id, tt.name));
    }
    for (var i = 0; i < json.pricings.length; i++) {
        var p = json.pricings[i];
        var pricing = new Pricing(p.id, p.name);
        for (var j = 0; j < p.tickets.length; j++) {
            pricing.Tickets.push(new Ticket(data.getTicketTypeByID(p.tickets[j].id), p.tickets[j].price));
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
        movie.ID = m.id;
        movie.Title = m.title;
        movie.Rating = m.rating;
        movie.Runtime = m.runtime;
        movie.PosterURL = m.posterUrl;
        movie.Synopsis = m.synopsis;
        movie.Cast = m.cast.slice();
        movie.Directors = m.directors.slice();
        data.movies.push(movie);
    }
    for (var i = 0; i < json.showings.length; i++) {
        var s = json.showings[i];
        data.showings.push(new Showing(s.id, data.getMovieByTitle(s.movieTitle), s.date, s.time, data.getTheaterByID(s.theater)));
    }
    return;
};

data.initializeData = function() {
    $.getJSON('scripts/data.json', data.initializeDataJson);
    return;
    /*
    //Types of tickets (Adult, Senior, etc)
    var ticketType = new TicketType();
    ticketType.ID = 1;
    ticketType.Name = 'Adult';
    data.ticketTypes.push(ticketType);
    
    ticketType = new TicketType();
    ticketType.ID = 2;
    ticketType.Name = 'Child';
    data.ticketTypes.push(ticketType);
    
    ticketType = new TicketType();
    ticketType.ID = 3;
    ticketType.Name = 'Senior';
    data.ticketTypes.push(ticketType);
    
    ticketType = new TicketType();
    ticketType.ID = 4;
    ticketType.Name = 'Student';
    data.ticketTypes.push(ticketType);
    
    //Pricing scheme for ticket types (standard, 3D, etc)
    var pricing = new Pricing();
    pricing.ID = 1;
    pricing.Name = 'Standard';
    pricing.Tickets.push(new Ticket(data.ticketTypes[0], 10.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[1], 7.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[2], 6.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[3], 8.00));
    data.pricings.push(pricing);
    
    pricing = new Pricing();
    pricing.ID = 2;
    pricing.Name = '3D';
    pricing.Tickets.push(new Ticket(data.ticketTypes[0], 12.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[1], 9.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[2], 8.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[3], 10.00));
    data.pricings.push(pricing);
    
    pricing = new Pricing();
    pricing.ID = 3;
    pricing.Name = 'IMAX';
    pricing.Tickets.push(new Ticket(data.ticketTypes[0], 15.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[1], 12.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[2], 11.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[3], 13.00));
    data.pricings.push(pricing);
    
    pricing = new Pricing();
    pricing.ID = 4;
    pricing.Name = 'IMAX 3D';
    pricing.Tickets.push(new Ticket(data.ticketTypes[0], 17.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[1], 14.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[2], 13.00));
    pricing.Tickets.push(new Ticket(data.ticketTypes[3], 15.00));
    data.pricings.push(pricing);
    
        
    //Theater Data
    var theater = new Theater();
    theater.ID = 1;
    theater.Name = 'Theater 1';
    theater.Pricing = data.getPricingByName('Standard');
    theater.Seats.push(new Seat('A', '1'));
    theater.Seats.push(new Seat('A', '2'));
    theater.Seats.push(new Seat('A', '3'));
    theater.Seats.push(new Seat('B', '1'));
    theater.Seats.push(new Seat('B', '2'));
    theater.Seats.push(new Seat('B', '3'));
    data.theaters.push(theater);
    
    theater = new Theater();
    theater.ID = 2;
    theater.Name = 'Theater 2';
    theater.Pricing = data.getPricingByName('3D');
    theater.Seats.push(new Seat('A', '1'));
    theater.Seats.push(new Seat('A', '2'));
    theater.Seats.push(new Seat('A', '3'));
    theater.Seats.push(new Seat('B', '1'));
    theater.Seats.push(new Seat('B', '2'));
    theater.Seats.push(new Seat('B', '3'));
    data.theaters.push(theater);
    
    theater = new Theater();
    theater.ID = 3;
    theater.Name = 'Theater 3';
    theater.Pricing = data.getPricingByName('IMAX');
    theater.Seats.push(new Seat('A', '1'));
    theater.Seats.push(new Seat('A', '2'));
    theater.Seats.push(new Seat('A', '3'));
    theater.Seats.push(new Seat('B', '1'));
    theater.Seats.push(new Seat('B', '2'));
    theater.Seats.push(new Seat('B', '3'));
    theater.Seats.push(new Seat('C', '1'));
    theater.Seats.push(new Seat('C', '2'));
    theater.Seats.push(new Seat('C', '3'));
    data.theaters.push(theater);
    
    theater = new Theater();
    theater.ID = 4;
    theater.Name = 'Theater 4';
    theater.Pricing = data.getPricingByName('IMAX 3D');
    theater.Seats.push(new Seat('A', '1'));
    theater.Seats.push(new Seat('A', '2'));
    theater.Seats.push(new Seat('A', '3'));
    theater.Seats.push(new Seat('B', '1'));
    theater.Seats.push(new Seat('B', '2'));
    theater.Seats.push(new Seat('B', '3'));
    theater.Seats.push(new Seat('C', '1'));
    theater.Seats.push(new Seat('C', '2'));
    theater.Seats.push(new Seat('C', '3'));
    data.theaters.push(theater);
    
    //Movie Data    
    var movie = new Movie();
    movie.ID = 1;
    movie.Title = 'Captain America : The Winter Soldier';
    movie.Rating = 'PG-13';
    movie.Runtime = '90 min';
    movie.PosterURL = 'images/captainAmerica.jpg';
    movie.Synopsis = 'Captain America is Americaing around with Robert Redford when suddenly, Rob is all like "Spying ain\'t too bad, right Cappy cap?"<br />Of course, the Captain is like, "Naw, man. That ish is bunk.", so he tries to bounce with ScarJo.Turns out, though, his buddy from WWII is still around, and some kind of evil robot, so The Captain has to introduce some America in to that jank before it\'s too late.';
    movie.Cast.push('Chris Evans');
    movie.Cast.push('Scarlett Johannsen');
    movie.Cast.push('Samuel L. Jackson');
    movie.Cast.push('Robert Redford');
    movie.Cast.push('Jet Powered Heli-Carrier');
    movie.Directors.push('Joe Russo');
    movie.Directors.push('Anthony Russo');
    data.movies.push(movie);
    
    movie = new Movie();
    movie.ID = 2;
    movie.Title = 'The Lego Movie';
    movie.Rating = 'PG';
    movie.Runtime = '100 min';
    movie.PosterURL = 'images/legoMovie.jpg';
    movie.Synopsis = 'An ordinary Lego construction worker, thought to be the prophesied "Special", is recruited to join a quest to stop an evil tyrant from gluing the Lego universe into eternal stasis.';
    movie.Cast.push('Chris Pratt');
    movie.Cast.push('Will Ferrell');
    movie.Cast.push('Elizabeth Banks');
    movie.Cast.push('Will Arnett');
    movie.Cast.push('Morgan Freeman');
    movie.Cast.push('Liam Neeson');
    movie.Directors.push('Phil Lord');
    movie.Directors.push('Christopher Miller');
    data.movies.push(movie);
    
    movie = new Movie();
    movie.ID = 3;
    movie.Title = 'Godzilla';
    movie.Rating = 'PG-13';
    movie.Runtime = '120 min';
    movie.PosterURL = 'images/godzilla.jpg';
    movie.Synopsis = 'Godzilla fights malevolent creatures that threaten humanity.';
    movie.Cast.push('Aaron Taylor-Johnson');
    movie.Cast.push('Ken Watanabe');
    movie.Cast.push('Elizabeth Olsen');
    movie.Cast.push('Juliette Binoche');
    movie.Cast.push('Sally Hawkins');
    movie.Cast.push('David Strathairn');
    movie.Cast.push('Bryan Cranston');
    movie.Directors.push('Gareth Edwards');
    data.movies.push(movie);
    
    var movie = new Movie();
    movie.ID = 4;
    movie.Title = 'Neighbors';
    movie.Rating = 'R';
    movie.Runtime = '97 min';
    movie.PosterURL = 'images/neighbors.jpg';
    movie.Synopsis = 'New parents Mac (Seth Rogen) and Kelly (Rose Byrne) move to the suburbs when they welcome an infant daughter into their lives. All goes well with the couple, until the Delta Psi Beta fraternity moves in next door. Mac and Kelly don\'t want to seem uncool, and they try their best to get along with frat president Teddy (Zac Efron) and the rest of the guys. However, when the couple finally call the cops during a particularly raucous frat party, a full-scale war erupts.';
    movie.Cast.push('Seth Rogen');
    movie.Cast.push('Zac Efron');
    movie.Cast.push('Rose Byrne');
    movie.Cast.push('Christopher Mintz-Plasse');
    movie.Cast.push('Dave Franco');
    movie.Cast.push('Lisa Kudrow');
    movie.Cast.push('Ike Barinholtzo');
    movie.Cast.push('Brian Huskey');
    movie.Cast.push('Halston Sage');
    movie.Cast.push('Jerrod Carmichael');
    movie.Cast.push('Craig Roberts');
    movie.Cast.push('Ali Cobrin');
    movie.Cast.push('Kira Sternbach');
    movie.Cast.push('Hannibal Buress');
    movie.Cast.push('Andy Samberg');
    movie.Cast.push('Akiva Schaffer');
    movie.Cast.push('Jorma Taccone');
    movie.Cast.push('Elise Vargas');
    movie.Cast.push('Zoey Vargas');
    movie.Directors.push('Nicholas Stoller');
    data.movies.push(movie);
    
    var movie = new Movie();
    movie.ID = 5;
    movie.Title = 'Million Dollar Arm';
    movie.Rating = 'PG';
    movie.Runtime = '124 min';
    movie.PosterURL = 'images/millionDollarArm.jpg';
    movie.Synopsis = 'In a last-ditch effort to save his failing career, sports agent J.B. Bernstein (Jon Hamm) plans to find baseball\'s next star pitcher. He heads to India to find a cricket player whom he can nurture into becoming a major league star. With the help of a scout (Alan Arkin), J.B. finds teens Dinesh (Madhur Mittal) and Rinku (Suraj Sharma), who haven\'t a clue about baseball but throw powerful pitches. As the boys adjust to American life, J.B. learns valuable lessons about teamwork and family.';
    movie.Cast.push('Jon Hamm');
    movie.Cast.push('Aasif Mandvi');
    movie.Cast.push('Bill Paxton');
    movie.Cast.push('Suraj Sharma');
    movie.Cast.push('Lake Bell');
    movie.Cast.push('Madhur Mittal');
    movie.Cast.push('Pitobash');
    movie.Cast.push('Alan Arkin');
    movie.Directors.push('Craig Gillespie');
    data.movies.push(movie);
    
    //Movie Showing Times
    var showing = new Showing();
    showing.ID = 1;
    showing.Movie = data.getMovieByTitle('Captain America : The Winter Soldier');
    showing.Date = 'Jan 1';
    showing.Time = '9:30am';
    showing.Theater = data.theaters[0];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);
    
    showing = new Showing();
    showing.ID = 2;
    showing.Movie = data.getMovieByTitle('Captain America : The Winter Soldier');
    showing.Date = 'Jan 1';
    showing.Time = '11:15am';
    showing.Theater = data.theaters[1];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);
    
    showing = new Showing();
    showing.ID = 3;
    showing.Movie = data.getMovieByTitle('Captain America : The Winter Soldier');
    showing.Date = 'Jan 1';
    showing.Time = '1:45pm';
    showing.Theater = data.theaters[3];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);
    
    showing = new Showing();
    showing.ID = 4;
    showing.Movie = data.getMovieByTitle('Captain America : The Winter Soldier');
    showing.Date = 'Jan 1';
    showing.Time = '5:30pm';
    showing.Theater = data.theaters[0];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);
    
    showing = new Showing();
    showing.ID = 5;
    showing.Movie = data.getMovieByTitle('Captain America : The Winter Soldier');
    showing.Date = 'Jan 1';
    showing.Time = '7:45pm';
    showing.Theater = data.theaters[2];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);
    showing = new Showing();
    
    showing.ID = 6;
    showing.Movie = data.getMovieByTitle('The Lego Movie');
    showing.Date = 'Jan 1';
    showing.Time = '2:45pm';
    showing.Theater = data.theaters[3];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);
    
    showing = new Showing();
    showing.ID = 7;
    showing.Movie = data.getMovieByTitle('The Lego Movie');
    showing.Date = 'Jan 1';
    showing.Time = '1:30pm';
    showing.Theater = data.theaters[0];
    showing.AvailableSeats.concat(showing.Theater.Seats);
    data.showings.push(showing);*/
};

//Helper Functions
data.getTicketTypeByID = function(id) {
    return data.getObjectByProperty(data.ticketTypes, 'ID', id);
};
data.getPricingByName = function(name) {
    return data.getObjectByProperty(data.pricings, 'Name', name); 
};
data.getMovieByID = function(id) {
    return data.getObjectByProperty(data.movies, 'ID', id);
};
data.getMovieByTitle = function(name) {
    return data.getObjectByProperty(data.movies, 'Title', name); 
};
data.getTheaterByID = function(id) {
    return data.getObjectByProperty(data.theaters, 'ID', id);
}
data.getShowingByID = function(id) {
    return data.getObjectByProperty(data.showings, 'ID', id);
};
data.getShowingsByMovie = function(movie) {
    return data.getArrayByProperty(data.showings, 'Movie', movie); 
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