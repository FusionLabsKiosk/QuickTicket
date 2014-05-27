function Theater(id, name, pricing) {
    
    var i = isNaN(id) ? -1 : id;
    var n = typeof name === 'string' ? name : '';
    var p = typeof pricing === 'undefined' ? new Pricing() : pricing;
    
    var self = this;
    
    this.ID = i;
    this.Name = n;
    this.Pricing = p;
    this.Seats = [];
    
    this.setTheaterData = function(theaterData) {
        $(theaterData).each(function() {
            $(this).find('.theater-name').html(self.Name);
            $(this).find('.theater-type').html(self.Pricing.Name);
            $(this).find('.theater-seats-total').html(self.Seats.length + 1);
        });
    };
}