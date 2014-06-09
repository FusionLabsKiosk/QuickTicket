function Receipt(showing) {
    
    var self = this;
    var s = typeof showing === 'undefined' ? new Showing() : showing;
    
    this.showing = s;
    this.tickets = [];
    this.paymentType = '';
    this.paymentObject = {};
    this.paymentTypeInfo = '';
    
    this.getTicketsWithQuantity = function() {
        var ticketQuantities = [];
        for (var i = 0; i < self.tickets.length; i++) {
            var found = -1;
            for (var j = 0; j < ticketQuantities.length; j++) {
                if (ticketQuantities[j].ticketType.name === self.tickets[i].ticketType.name) {
                    found = j;
                    break;
                }
            }
            if (found > -1) {
                ticketQuantities[j].Quantity += 1;
            }
            else {
                self.tickets[i].Quantity = 1;
                ticketQuantities.push(self.tickets[i]);
            }
        }
        
        return ticketQuantities;
    };
}