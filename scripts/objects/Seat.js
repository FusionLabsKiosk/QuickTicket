function Seat(row, column) {
    
    var self = this;
    
    var r = typeof row === 'String' ? row : '';
    var c = typeof column === 'String' ? column : '';
    
    this.Row = r;
    this.Column = c;
}