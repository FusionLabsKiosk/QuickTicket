function Seat(row, column) {
    
    var self = this;
    
    var r = typeof row === 'String' ? row : '';
    var c = typeof column === 'String' ? column : '';
    
    this.row = r;
    this.column = c;
}