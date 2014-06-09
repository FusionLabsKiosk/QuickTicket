function Movie() {
    
    var self = this;
    
    this.id = -1;
    this.title = '';
    this.rating = '';
    this.runtime = '';
    this.posterUrl = '';
    this.synopsis = '';
    this.cast = [];
    this.directors = [];
    
    this.setMovieData = function(movieData) {
        $(movieData).each(function() {
            $(this).find('.movie-title').html(self.title);
            $(this).find('.movie-rating').html('<span class="title">Rating: </span><span class="rating">' + self.rating + '</span>');
            $(this).find('.movie-runtime').html(self.runtime);
            $(this).find('.movie-poster').attr('src', self.posterUrl);
            $(this).find('.movie-poster').css('background-image', 'url("' + self.posterUrl + '")');
            $(this).find('.movie-synopsis').html(self.synopsis);
            var cast = $(this).find('.movie-cast').empty();
            var castLimit = (self.cast.length > 7 ) ? 7 : self.cast.length;
            for (var i = 0; i < castLimit; i++) {
                cast.append($('<div/>').html(self.cast[i]));
            }
            var directors = $(this).find('.movie-directors').empty();
            var directorsLimit = (self.directors.length > 7 ) ? 7 : self.directors.length;
            for (var i = 0; i < directorsLimit; i++) {
                directors.append($('<div/>').html(self.directors[i]));
            }
        });
    };
    this.getCarouselDiv = function() {
        var div = $('<div/>').addClass('movie').attr('data-id', self.id);
        div.append($('<img>').addClass('movie-poster').attr('src', self.posterUrl));
        var movieData = $('<div/>').addClass('movie-data');
        //movieData.append($('<div/>').addClass('movie-title'));
        movieData.append($('<div/>').addClass('movie-rating'));
        self.setMovieData(movieData);
        div.append(movieData);
        //div.append($('<button/>').addClass('view-show-times').html('View Show Times'));
        
        return div;
    };
}