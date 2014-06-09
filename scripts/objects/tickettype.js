function TicketType(id, name) {
    
    var i = isNaN(id) ? -1 : id;
    var n = typeof name === 'string' ? name : '';
    
    this.id = i;
    this.name = n;    
}