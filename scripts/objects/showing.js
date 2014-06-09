function Showing(id, movie, date, time, theater) {
    
    var i = isNaN(id) ? -1 : id;
    var m = typeof movie === 'undefined' ? new Movie() : movie;
    var d = typeof date === 'string' ? date : '';
    var t = typeof time === 'string' ? time : '';
    var th = typeof theater === 'undefined' ? new Theater() : theater;
    
    var self = this;
    
    this.id = i;
    this.movie = m;
    this.date = d;
    this.time = t;
    this.theater = th;
    this.availableSeats = th.seats.slice();
    
    this.setShowingData = function(showingData) {
        $(showingData).each(function() {
            $(this).find('.showing-date').html(self.date);
            $(this).find('.showing-time').html(self.time);
            $(this).find('.showing-type').html(self.theater.pricing.name);
            $(this).find('.showing-seats-available').html(self.availableSeats.length + 1);
        });
    };
    
    this.getShowingButton = function() {
        var button = $('<button/>').addClass('showing', 'showing-data').attr('data-id', self.id);
        button.append($('<span/>').addClass('showing-time'));
        button.append($('<span/>').addClass('showing-type'));
        self.setShowingData(button);
        
        return button;
    };
}