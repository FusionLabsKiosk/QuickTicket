function Receipt(showing) {
    
    var self = this;
    var s = typeof showing === 'undefined' ? new Showing() : showing;
    
    this.Showing = s;
    this.Tickets = [];
    this.PaymentType = '';
    this.PaymentTypeInfo = '';
    
    this.getTicketsWithQuantity = function() {
        var ticketQuantities = [];
        for (var i = 0; i < self.Tickets.length; i++) {
            var found = -1;
            for (var j = 0; j < ticketQuantities.length; j++) {
                if (ticketQuantities[j].TicketType.Name === self.Tickets[i].TicketType.Name) {
                    found = j;
                    break;
                }
            }
            if (found > -1) {
                ticketQuantities[j].Quantity += 1;
            }
            else {
                self.Tickets[i].Quantity = 1;
                ticketQuantities.push(self.Tickets[i]);
            }
        }
        
        return ticketQuantities;
    };
}