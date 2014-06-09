function Ticket(ticketType, price) {
    
    var t = typeof ticketType === 'undefined' ? new TicketType() : ticketType;
    var p = typeof price === 'undefined' ? 0.00 : parseInt(price);

    this.ticketType = t;
    this.price = p;
    this.id = (Math.floor(Math.random()*10) + 1).toString() + '-' + (Math.floor(Math.random()*100) + 1).toString();
}