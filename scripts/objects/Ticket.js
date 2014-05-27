function Ticket(ticketType, price) {
    
    var t = typeof ticketType === 'undefined' ? new TicketType() : ticketType;
    var p = typeof price === 'undefined' ? 0.00 : parseInt(price);

    this.TicketType = t;
    this.Price = p;
}