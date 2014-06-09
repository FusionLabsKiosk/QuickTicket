function Theater(id, name, pricing) {
    
    var i = isNaN(id) ? -1 : id;
    var n = typeof name === 'string' ? name : '';
    var p = typeof pricing === 'undefined' ? new Pricing() : pricing;
    
    var self = this;
    
    this.id = i;
    this.name = n;
    this.pricing = p;
    this.seats = [];
    
    this.setTheaterData = function(theaterData) {
        $(theaterData).each(function() {
            $(this).find('.theater-name').html(self.name);
            $(this).find('.theater-type').html(self.pricing.name);
            $(this).find('.theater-seats-total').html(self.seats.length + 1);
        });
    };
}