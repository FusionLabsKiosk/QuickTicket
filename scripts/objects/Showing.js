function Showing(id, movie, date, time, theater) {
    
    var i = isNaN(id) ? -1 : id;
    var m = typeof movie === 'undefined' ? new Movie() : movie;
    var d = typeof date === 'string' ? date : '';
    var t = typeof time === 'string' ? time : '';
    var th = typeof theater === 'undefined' ? new Theater() : theater;
    
    var self = this;
    
    this.ID = i;
    this.Movie = m;
    this.Date = d;
    this.Time = t;
    this.Theater = th;
    this.AvailableSeats = th.Seats.slice();
    
    this.setShowingData = function(showingData) {
        $(showingData).each(function() {
            $(this).find('.showing-date').html(self.Date);
            $(this).find('.showing-time').html(self.Time);
            $(this).find('.showing-type').html(self.Theater.Pricing.Name);
            $(this).find('.showing-seats-available').html(self.AvailableSeats.length + 1);
        });
    };
    
    this.getShowingButton = function() {
        var button = $('<button/>').addClass('showing', 'showing-data').attr('data-id', self.ID);
        button.append($('<span/>').addClass('showing-time'));
        button.append($('<span/>').addClass('showing-type'));
        self.setShowingData(button);
        
        return button;
    };
}