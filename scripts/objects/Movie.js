function Movie() {
    
    var self = this;
    
    this.ID = -1;
    this.Title = '';
    this.Rating = '';
    this.Runtime = '';
    this.PosterURL = '';
    this.Synopsis = '';
    this.Cast = [];
    this.Directors = [];
    
    this.setMovieData = function(movieData) {
        $(movieData).each(function() {
            $(this).find('.movie-title').html(self.Title);
            $(this).find('.movie-rating').html('<span class="title">Rating: </span><span class="rating">' + self.Rating + '</span>');
            $(this).find('.movie-runtime').html(self.Runtime);
            $(this).find('.movie-poster').attr('src', self.PosterURL);
            $(this).find('.movie-poster').css('background-image', 'url("' + self.PosterURL + '")');
            $(this).find('.movie-synopsis').html(self.Synopsis);
            var cast = $(this).find('.movie-cast').empty();
            var castLimit = (self.Cast.length > 7 ) ? 7 : self.Cast.length;
            for (var i = 0; i < castLimit; i++) {
                cast.append($('<div/>').html(self.Cast[i]));
            }
            var directors = $(this).find('.movie-directors').empty();
            var directorsLimit = (self.Directors.length > 7 ) ? 7 : self.Directors.length;
            for (var i = 0; i < directorsLimit; i++) {
                directors.append($('<div/>').html(self.Directors[i]));
            }
        });
    };
    this.getCarouselDiv = function() {
        var div = $('<div/>').addClass('movie').attr('data-id', self.ID);
        div.append($('<img>').addClass('movie-poster').attr('src', self.PosterURL));
        var movieData = $('<div/>').addClass('movie-data');
        //movieData.append($('<div/>').addClass('movie-title'));
        movieData.append($('<div/>').addClass('movie-rating'));
        self.setMovieData(movieData);
        div.append(movieData);
        //div.append($('<button/>').addClass('view-show-times').html('View Show Times'));
        
        return div;
    };
}